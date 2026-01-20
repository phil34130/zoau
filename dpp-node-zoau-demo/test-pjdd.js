const { exec } = require('child_process');

// Remplacez par un JobID que vous savez existant (ex: JOB06622)
const jobid = "JOB06606";
const command = `pjdd ${jobid} '*'`;

console.log(`?? Execution de la commande : ${command}`);

exec(command, (error, stdout, stderr) => {
    if (error) {
        console.error(`? Erreur d'ex‚cution : ${error.message}`);
        console.error(`?? Stderr : ${stderr}`);
        return;
    }

    if (stderr) {
        console.log(`?? Note (stderr) : ${stderr}`);
    }

    console.log("? Resultat de pjdd :");
    console.log("-----------------------------------");
    console.log(stdout); // C'est ici que l'output du job doit s'affiche
    console.log("-----------------------------------");
});
