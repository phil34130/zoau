// List members of a PDS.
let dernierJobId = ""; // Elle est vide au chargement de la page
function listMembers() {
  var pds = document.getElementById('pds').value;

  fetch(`/api/${pds}`)
    .then(response => response.json())
    .then(members => {
      var select = document.getElementById('members');

      // Clear existing options.
      for (var i = select.options.length - 1; i >= 0; i--) {
        select.remove(i);
      }

      // Populate with new options.
      for (member of members){
        var option = document.createElement('option');
        option.value = member;
        option.innerHTML = member;
        select.appendChild(option);
      }
      printOutput('Success');
    })
    .catch(err => printOutput(err));
}

// Get content of a member.
function getContent() {
  var pds = document.getElementById('pds').value;
  var member = document.getElementById('members').value;

  fetch(`/api/${pds}/${member}`)
    .then(response => response.json())
    .then(content => {
      document.getElementById('content-label').innerText = `${pds}(${member})`;
      document.getElementById('content').value = content;
      printOutput('Success');
    })
    .catch(err => printOutput(err));
}

// Write to the member of a PDS.
function writeContent() {
  var pds = document.getElementById('pds').value;
  var member = document.getElementById('members').value;
  var content = document.getElementById('content').value;

  fetch(`/api/${pds}/${member}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ content })
  })
  .then(response => response.json())
  .then(data => {
       // data est l'objet { rc: 0, message: "..." }
       printOutput(`Return Code: ${data.rc} Msg: ${data.message}`);

       // Optionnel : afficher aussi le message de succes
       if (data.rc === 0) {
           console.log(data.message);
       }
   })
   .catch(err => printOutput("Erreur: " + err));
}
// res.json({ rc: 0, message: "Member updated successfully" });

// Creer un nouveau membre
function createMember() {
  var pds = document.getElementById('pds').value;
  var newMember = prompt("Entrez le nom du nouveau membre :");

  if (!newMember) return; // Annuler si vide

  fetch(`/api/${pds}/${newMember.toUpperCase()}`, {
    method: 'POST'
  })
  .then(response => response.json())
  .then(msg => {
    printOutput(msg);
    listMembers(); // Rafraåchir la liste automatiquement
  })
  .catch(err => printOutput(err));
}

// Supprimer le membre selectionne
function deleteMember() {
  var pds = document.getElementById('pds').value;
  var member = document.getElementById('members').value;

  if (!member) {
    alert("Veuillez selectionner un membre a supprimer.");
    return;
  }

  if (confirm(`Etes-vous sur de vouloir supprimer ${pds}(${member}) ?`)) {
    fetch(`/api/${pds}/${member}`, {
      method: 'DELETE'
    })
    .then(response => response.json())
    .then(msg => {
      printOutput(msg);
      listMembers(); // Rafraåchir la liste
    })
    .catch(err => printOutput(err));
  }
}

// Submit JCL
function submitJCL() {
    var pds = document.getElementById('pds').value;
    var member = document.getElementById('members').value;

    printOutput("Soumission du job en cours...");

    fetch(`/api/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pds, member })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            dernierJobId = data.jobId; // On memorise le numero ici !
            printOutput(`Job soumis : ${data.jobId}. Use Read output button at bottom.`);
  // ETAPE CLE : On affiche le bouton "Verifier" ici
            document.getElementById('btn-output').style.display = 'inline-block';
        }
    })
    .catch(err => printOutput("Erreur soumission: " + err));
    // Lance automatiquement le premier rafraåchissement 2 secondes apres soumission
    setTimeout(refreshStatus, 2000);
}
async function refreshStatus() {
    console.log("Tentative de rafraåchissement du statut..."); // Pour vÇrifier dans la console
    if (!dernierJobId) {
        alert("Avez vous bien soumis votre JCL?");
        return;
    }
      try {
        const response = await fetch(`/get-job-status/${dernierJobId}`);
        const data = await response.json();

        if (data.success) {
            // Remplissage des champs dans l'index.html
            document.getElementById('job-id-display').innerText = data.jobId;
            document.getElementById('job-name').innerText = data.jobName;
            document.getElementById('job-owner').innerText = data.jobOwner;
            const btnPurge = document.getElementById('btn-purge');
            const btnOutput = document.getElementById('btn-output');

            const statusLabel = document.getElementById('job-rc');
            statusLabel.innerText = data.status;
                // Gestion de la couleur et du bouton d'output
          if (data.status.includes("CC")) {
                  // Job Termine : On peut voir l'output ET purger
                  if (btnOutput) btnOutput.style.display = "block";
                  if (btnPurge) btnPurge.style.display = "block";
                  statusLabel.style.color = "green";
              }
              else if (data.status.includes("AC")) {
                  // Job en cours : On ne peut pas voir l'output, mais on peut ANN
                  if (btnOutput) btnOutput.style.display = "none";
                  if (btnPurge) btnPurge.style.display = "block";
                  statusLabel.style.color = "blue";
              }
              else {
                  // Autres cas (QUEUE, etc.)
                  if (btnPurge) btnPurge.style.display = "none";
              }
          }
        } catch (err) {
            console.error("Erreur de rafraåchissement:", err);
        }
    }

async function checkStatus() {
    if (!dernierJobId) {
        printOutput("?? Aucun JobID trouve.");
        return;
    }
    printOutput(`\n--- Tentative de lecture sur Flask pour ${dernierJobId} ---`);

    try {
  // On appelle maintenant Node.js au lieu de Flask directement
  const response = await fetch(`/view-job-output/${dernierJobId}`);

        if (!response.ok) throw new Error(`Erreur : ${response.status}`)

        // On utilise .text() au lieu de .json() car c'est du texte brut
        const texteBrut = await response.text();

// On ouvre un onglet vide avec un titre
        const fenetre = window.open('', '_blank');

        // On ecrit le contenu
        fenetre.document.write('<html><head><title>Job Output</title></head><body>');
        fenetre.document.write('<pre>' + texteBrut + '</pre>');
        fenetre.document.write('</body></html>');
        fenetre.document.close();

    } catch (error) {
        printOutput(`? Erreur : ${error.message}`);
    }
}

async function purgeJob() {
    // On recupere le nom qui est affiche dans le span de l'interface
    const currentJobName = document.getElementById('job-name').innerText;

    if (!dernierJobId || currentJobName === "---") {
        showNotification("Donnees du job incompletes", "#f0ad4e");
        return;
    }

    if (!confirm(`Voulez-vous annuler et purger ${currentJobName} (${dernierJobId}) ?`)) return;
 try {
        // On envoie les deux parametres a la route
        const response = await fetch(`/purge-job/${currentJobName}/${dernierJobId}`);
        const data = await response.json();
        console.log("Statut reáu du serveur :", data.status);

        if (data.success) {
            showNotification("!!! " + data.message);

            // Reset de l'interface
            document.getElementById('job-id-display').innerText = "---";
            document.getElementById('job-name').innerText = "---";
            document.getElementById('job-rc').innerText = "Purged";
            document.getElementById('btn-output').style.display = "none"
            document.getElementById('btn-purge').style.display = "none";
        }
    } catch (error) {
        console.error("Erreur lors du purge:", error);
    }
}
// Fonction pour afficher des messages sans bloquer l'ecran
function showNotification(message) {
    const display = document.getElementById('output-display');

    if (display) {
        // On rÇcupäre l'heure actuelle pour le log
        const horodatage = new Date().toLocaleTimeString();

        // On ajoute le nouveau message AU-DESSUS de l'ancien contenu
        // \n sert Ö sauter une ligne
        display.innerText = `[${horodatage}] ${message}\n` + display.innerText;

        // Petit effet visuel : on fait dÇfiler vers le haut
        display.scrollTop = 0;
    } else {
        console.log("Log: " + message);
    }
}
// Show the #results div and print the output to the #output preformatted block.
function printOutput(output) {
  console.log(output);
  document.getElementById('results').style.display = 'initial';
  document.getElementById('output').innerText = output.toString();
  // Scroll to top of the screen.
  window.scrollTo(0, 0);
}
