#!/bin/sh
#
# 1. Soumission
JOBID=$(jsub "PRICHAR.PYTHON.JCL(HELLO)")
echo "Job soumis : $JOBID"

# 2. Attente (votre JCL a un sleep 5)
sleep 20

# 3. R‚cup‚ration du r‚sultat
echo "--- RESULTAT DU JOB ---"
jls  $JOBID
# 4. R‚cup‚ration de l'output
echo "--- OUTPUT DU JOB ---"
pjdd $JOBID '*'
