from flask import Flask, render_template, redirect, url_for

app = Flask(__name__)

# Página inicial redireciona para login
@app.route('/')
def index():
    return redirect(url_for('login'))

# Página de login
@app.route('/login')
def login():
    return render_template('login.html')

# Página de cadastro
@app.route('/cadastro')
def cadastro():
    return render_template('cadastro.html')

# 🔹 Página de perfil COM ID na rota
@app.route('/perfil/<int:id_usuario>')
def perfil(id_usuario):
    return render_template('Perfil.html', id_usuario=id_usuario)

# Página de projetos (recebe ID do usuário)
@app.route('/projetos/<int:id_usuario>')
def projetos(id_usuario):
    return render_template('projetos.html', id_usuario=id_usuario)

# Página de detalhes do projeto
@app.route('/projeto/<int:id_projeto>')
def projeto_detalhes(id_projeto):
    return render_template('projeto_individual.html', id_projeto=id_projeto)

'''if __name__ == "__main__":
    print("🚀 Servidor Flask rodando em modo DEBUG...")
    app.run(debug=True)'''
