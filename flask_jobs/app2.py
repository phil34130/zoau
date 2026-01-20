# flask_example/app.py
from flask import Flask
from flask import request, redirect, render_template
from zoautil_py import jobs
from zoautil_py import mvscmd, datasets
app = Flask(__name__)

@app.route('/')
def list_jobs():
    jobl = jobs.fetch_multiple(job_owner=datasets.get_hlq())
#    jobs =  jobs.fetch_multiple()
    return render_template('jobs.html', jobs=jobl)

@app.route('/cancel/<job_id>')
def cancel_job(job_id):
    jobs.cancel(job_id)
    return redirect('/')

@app.route('/purge/<job_id>')
def purge_job(job_id):
    jobs.purge(job_id)
    return redirect('/')

@app.route('/read/<job_id>')
def read_job(job_id):
    try:
        # On utilise des  quotes a l'interieur du string
        # pour proteger l'asterisque du shell z/OS
        allsteps =  "'*'"

        output_text = jobs.read_output(job_id, allsteps)

        from flask import Response
        return Response(output_text, mimetype='text/plain')

    except Exception as e:
        return f"Erreur lors de la lecture du job : {str(e)}", 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=54683))
