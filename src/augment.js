const fs = require('fs')
const Jimp = require('jimp')

const inputDir = 'src/images/Celerg'
const outputDir = 'src/images/output/Celerg'

const factory = async (image) => {
  return Jimp.read(image.path).then((jimp) => {
    return jimp.autocrop(0.2).resize(512, 512)
  })
}

const rotate = async (image, degrees, output) => {
  return factory(image).then((jimp) => {
    jimp.rotate(degrees).write(`${output}/r(${degrees})-${image.name}`)
  })
}

const mirror = async (image, output) => {
  return factory(image).then((jimp) => {
    jimp.mirror(true, false).write(`${output}/m(h)-${image.name}`)
  })
}

const contrast = async (image, value, output) => {
  return factory(image).then((jimp) => {
    jimp.contrast(value).write(`${output}/c(${value})-${image.name}`)
  })
}

const augment = (iteration, directory) => {
  const names = fs.readdirSync(directory)

  const images = names.map((name) => ({
    name: `${iteration}-${name}`,
    path: `${directory}/${name}`
  }))

  images.map((image) => {
    rotate(image, 0, outputDir)
    rotate(image, 45, outputDir)
    rotate(image, 90, outputDir)
    mirror(image, outputDir)
    contrast(image, 0.5, outputDir)
  })
}

const run = async () => {
  augment(3, outputDir)
}

run()
