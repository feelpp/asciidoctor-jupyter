/* global describe it */
// const util = require('util')
const fs = require('fs').promises
const path = require('path')
const chai = require('chai')
const expect = chai.expect
const dirtyChai = require('dirty-chai')

chai.use(dirtyChai)

const JupyterConverter = require('../src/index.js')
const asciidoctor = require('@asciidoctor/core')()

describe('Jupyter converter', () => {
  it('should convert to ipynb', async () => {
    asciidoctor.ConverterFactory.register(new JupyterConverter(), ['jupyter'])
    const content = await fs.readFile(path.join(__dirname, 'fixtures', 'hello-world.adoc'))
    const result = asciidoctor.convert(content, { backend: 'jupyter' })
    expect(result).is.not.empty()
    const ipynb = JSON.parse(result)
    expect(ipynb.metadata.language_info.name).is.equal('python')
    expect(ipynb.metadata.language_info.version).is.equal('2.7.10')
    expect(ipynb.cells.length).is.equal(35)
    // await fs.writeFile('hello-world.ipynb', result, 'utf8')
    // console.log(util.inspect(ipynb, false, Infinity, true))
  })
  it('should convert an exercice guide to ipynb', async () => {
    asciidoctor.ConverterFactory.register(new JupyterConverter(), ['jupyter'])
    const inputFile = path.join(__dirname, 'fixtures', 'intro-neo4j-guides-01.adoc')
    const result = asciidoctor.convertFile(inputFile, {
      safe: 'safe',
      backend: 'jupyter',
      to_file: false
    })
    expect(result).is.not.empty()
    const ipynb = JSON.parse(result)
    expect(ipynb.metadata.language_info.name).is.equal('python')
    expect(ipynb.metadata.language_info.version).is.equal('3.9.1')
    expect(ipynb.cells.length).is.equal(20)
    // await fs.writeFile('intro-neo4j-guides-01.ipynb', result, 'utf8')
    // console.log(util.inspect(ipynb, false, Infinity, true))
  })
})
