# ---------------------------------------------------------------------------------------
# Imports / Dependencies
# ---------------------------------------------------------------------------------------
from flask import Flask, render_template, request, redirect, url_for, flash, session
import os
from flask import jsonify

# ---------------------------------------------------------------------------------------
# App configuration
# ---------------------------------------------------------------------------------------
app = Flask(__name__)
app.secret_key = 'your_secret_key'
UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
# Store uploaded files metadata in memory for PoC
uploaded_files = []


# ---------------------------------------------------------------------------------------
# Helpers / Session utilities
# ---------------------------------------------------------------------------------------
def is_logged_in():
    """Return True when the user is logged in (stored in Flask session)."""
    return session.get('logged_in', False)


# ---------------------------------------------------------------------------------------
#  Routes / Controllers
# ---------------------------------------------------------------------------------------

@app.route('/')
def home():
    return render_template('login.html')

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        email = request.form['email']
        password = request.form['password']
        # Dummy authentication logic
        if email == 'admin@example.com' and password == 'password':
            session['logged_in'] = True
            return redirect(url_for('dashboard'))
        else:
            flash('Invalid credentials. Please try again.')
            return redirect(url_for('login'))
    return render_template('login.html')

@app.route('/dashboard')
def dashboard():
    if not is_logged_in():
        return redirect(url_for('login'))
    return render_template('admin_dashboard.html', files=uploaded_files)

# ---------------------------------------------------------------------------------------

@app.route("/upload", methods=["POST"])
def upload_file():
    if not is_logged_in():
        return redirect(url_for('login'))
    files = request.files.getlist('files')
    for file in files:
        if file and file.filename:
            # ensure unique filename to avoid overwriting
            filename = file.filename
            filepath = os.path.join(UPLOAD_FOLDER, filename)
            # if file exists, append a counter
            base, ext = os.path.splitext(filename)
            counter = 1
            while os.path.exists(filepath):
                filename = f"{base}({counter}){ext}"
                filepath = os.path.join(UPLOAD_FOLDER, filename)
                counter += 1
            file.save(filepath)
            uploaded_files.append({"name": filename, "size": os.path.getsize(filepath)})
    return redirect(url_for('dashboard'))

# ---------------------------------------------------------------------------------------

@app.route('/logout')
def logout():
    session.pop('logged_in', None)
    return redirect(url_for('login'))

if __name__ == '__main__':
    app.run(debug=True , port=5002)
    