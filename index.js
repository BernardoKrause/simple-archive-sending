const http = require('http');
const fs = require('fs');
const formidavel = require('formidable')
const porta = 443;

async function listarArquivos(diretorio, arquivos) {
  if (!arquivos)
    arquivos = []
  let listagemArquivos = fs.readdirSync(diretorio)
  console.log(listagemArquivos)
}

const server = http.createServer((req, res) => {
  fs.readFile('pagina.html', (err, arquivo) => {    
    if (req.url != '/enviodearquivo') {
      res.writeHead(200, { 'Content-Type' : 'text/html' })
      res.write(arquivo);
      res.write('<form action="enviodearquivo" method="post" enctype="multipart/form-data">')
      res.write('<input type="file" name="filetoupload"><br>')
      res.write('<input type = "submit" value="Enviar">')
      res.write('</form>')
  
      return res.end();
    } else {
      const form = new formidavel.IncomingForm()
      form.parse(req, (erro, campos, arquivos) => {
        const urlAntiga = arquivos.filetoupload.filepath
        const urlNova = './enviodearquivo/' + arquivos.filetoupload.originalFilename
        var rawData = fs.readFileSync(urlAntiga)
        fs.writeFile(urlNova, rawData, function(err) {
          if(err) console.log(err)
          listarArquivos('./enviodearquivo');
          res.write('Arquivo enviado com sucesso!')
          res.end()
        })
    })
  }
  })
  
})

server.listen(porta, () => console.log('Servidor rodando'));