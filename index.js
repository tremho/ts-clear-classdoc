#!/usr/bin/env node

const fs = require('fs')
const path = require('path')

const jsdir = process.argv[2]

if(fs.existsSync(jsdir)) {
  if(fs.statSync(jsdir).isDirectory()) {
    enumFiles(jsdir)
  } else {
    // in this case, jsdir is a file.
    if(jsdir.substring(jsdir.length-3) === '.js') {
      processFile(jsdir)
    }
  }
}

function enumFiles(dir) {
  const fsdir = fs.opendirSync(dir)
  let dirent = fsdir.readSync()
  while(dirent) {
    if(dirent.name.charAt(0) !== '.') { // skip 'hidden' files
      if (dirent.isDirectory()) {
        enumFiles(path.join(fsdir.path, dirent.name))
      }
      if (dirent.isFile()) {
        const name = dirent.name;
        if (name.substring(name.length - 3) === '.js') {
          processFile(path.join(fsdir.path, name))
        }
      }
    }
    dirent = fsdir.readSync()
  }
}

function processFile(sourceFile) {
  if(fs.existsSync(sourceFile)) {
    let text = fs.readFileSync(sourceFile).toString()
    let cre = /\/\*\* @class \*\/ /g
    let found = text.match(cre) || []
    text = text.replace(cre, '')
    fs.writeFileSync(sourceFile, text)
    if(found.length) console.log(`${sourceFile}: ${found.length} class doc stubs removed`)
  } else {
    console.error(`unable to read sourcefile "${sourceFile}"`)
    process.exit(1)
  }
}



