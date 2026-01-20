const util = require('util');
const { exec } = require('child_process');
const express = require('express');
const router = express.Router();

  const zoau = require('zoau');
//nst zoau = require('./lib/zoau.js')
//nst ds = require('./lib/zoau.js').datasets;
const datasets = require('zoau').datasets;
  console.log("Fonctions disponibles dans datasets :", Object.keys(datasets));
// REST API
// List members of a PDS.
router.get('/api/:pds', (req, res, next) => {
  zoau.datasets.listMembers(req.params.pds)
    .then(members => res.json(members))
    .catch(err => next(err));
});

// Get content of a member.
router.get('/api/:pds/:member', (req, res, next) => {
  zoau.datasets.read(`${req.params.pds}(${req.params.member})`)
    .then(content => res.json(content))
    .catch(err => next(err));
});
// save &write content into member

const { execSync } = require('child_process');

router.put('/api/:pds/:member', (req, res, next) => {
    const dataset = `${req.params.pds}(${req.params.member})`;
    let content = req.body.content;

    if (content === undefined || content === null) {
        return next(new Error('Content must be specified'));
    }

    // 1. Nettoyage simple des fins de ligne
    content = content.replace(/\r\n/g, '\n');

    // 2. IMPORTANT : On supprime les espaces inutiles en fin de ligne
    // pour eviter l'erreur "exceeds 80 characters" que vous aviez au d‚
    const cleanContent = content.split('\n')
                                .map(line => line.trimEnd().substring(0, 80))
                                .join('\n');
    try {
        // Plutot que zoau.datasets.write qui semble bugger avec votre v
        // on utilise le "pipe" vers decho. C'est la m‚thode la plus rob
        // L'option 'input' envoie le contenu directement via stdin (sta

        execSync(`decho "${dataset}"`, {
            input: cleanContent,
            encoding: 'utf8'
        });

        res.json({ rc: 0, message: "Member updated successfully" });
    } catch (err) {
        // Si decho renvoie une erreur (comme le d‚passement de 80 carac
        console.error("Erreur decho:", err.stderr);
        res.status(500).json({
            rc: err.status,
            stderr: err.stderr ? err.stderr.toString() : err.message
        });
    }
});

// Creer un nouveau membre (ou l'ecraser s'il existe)
router.post('/api/:pds/:member', (req, res) => {
  const { pds, member } = req.params;
  const fullPath = `${pds}(${member})`;

  // On ecrit une chaine vide pour creer le membre
  zoau.datasets.write(fullPath, "")
    .then(() => res.json(`Membre ${member} cree avec succes.`))
    .catch(err => res.status(500).json(err.message));
});

// Remplacez votre route DELETE actuelle par celle-ci :
router.delete('/api/:pds/:member', (req, res) => {
  const { pds, member } = req.params;
  const fullPath = `${pds}(${member})`;

  // Utilisation de deleteMembers u lieu de delete
  zoau.datasets.deleteMembers(fullPath)
    .then(() => {
      res.json(`Membre ${member} supprime avec succes de ${pds}.`);
    })
    .catch(err => {
      // Si deleteMember n'existe pas dans votre version,
      // on peut aussi passer par une commande shell directe.
      console.error("Erreur detectee :", err);
      res.status(500).json("Erreur lors de la suppression : " + err.message);
    });
});

// submit JCL
// Route pour soumettre le Job
router.post('/api/submit', (req, res) => {
    const { pds, member } = req.body;
    const dataset = `${pds}(${member})`;

    try {
        // jsub renvoie le JOBID (ex: JOB01234)
        const jobId = execSync(`jsub "${dataset}"`, { encoding: 'utf8' }).trim();
        res.json({ success: true, jobId: jobId });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// Votre route "pont" qui va maintenant utiliser pjdd
router.get('/view-job-output/:jobid', (req, res) => {
    const jobid = req.params.jobid;

    // On prepare la commande shell
    const command = `pjdd ${jobid} '*'`;

    // On lance l'execution sur le systeme z/OS
    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.error(`Erreur pjdd: ${error.message}`);
            return res.status(500).send("Erreur lors de la lecture du Job.");
        }

        // On renvoie le r‚sultat brut (stdout) au navigateur
        // Le navigateur le recevra et l'affichera dans l'onglet vierge
        res.send(stdout);
    });
});
// Route pour obtenir uniquement le Condition Code (JSON)
router.get('/get-job-status/:jobid', (req, res) => {
    const jobid = req.params.jobid;
    const command = `jls -j ${jobid}`;

    exec(command, (error, stdout, stderr) => {
        if (error || !stdout) {
            return res.json({ success: false, status: "Erreur JLS" });
        }

        try {
            // 1. On transforme le texte recu en objet JSON
            const resultatComplet = JSON.parse(stdout);

            // 2. On acccde aux donnces du Job spccifique
            const jobData = resultatComplet.data[jobid];

            let statusFinal = "Ind‚termin‚";
            if (jobData) {
                // Si le statut est "AC", le job tourne encore
                if (jobData.status === "AC") {
                    statusFinal = "AC (En cours)";
                }
                // Si le ccode n'est plus "?", c'est qu'il est fini
                else if (jobData.ccode && jobData.ccode !== "?") {
                    statusFinal = `CC ${jobData.ccode}`;
                }
                // Sinon, on renvoie le statut brut (ex: OUTPUT, QUEUE)
                else {
                    statusFinal = jobData.status;
                }
            }
            res.json({
                success: true,
                jobId: jobid,
                status: statusFinal,
                jobName: jobData.name,   // Ajout du nom
                jobOwner: jobData.owner  // Ajout du propri‚
            });

        } catch (e) {
            console.error("Erreur de parsing JSON:", e);
            res.json({ success: false, status: "Erreur Format" });
        }
    });
});
// Route pour purger un job (jcan C <jobname> <jobid>
router.get('/purge-job/:jobname/:jobid', (req, res) => {
    const { jobname, jobid } = req.params;

    // Commande correcte : jcan C [jobname] [jobid]
    const command = `jcan C ${jobname} ${jobid}`;

    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.error(`Erreur jcan: ${stderr}`);
            return res.json({ success: false, message: "echec de l'annulation." });
        }
        res.json({
            success: true,
            message: `Job ${jobname}(${jobid}) purged/cancelled.`
        });
    });
});

module.exports = router;
