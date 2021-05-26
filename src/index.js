const fs = require('fs')
const Jimp = require('jimp')

const inputDir = 'src/images/Celerg'
const outputDir = 'src/images/output/Celerg'

const names = fs.readdirSync(inputDir)
const images = names.map((name) => ({
  name,
  path: `${inputDir}/${name}`
}))

const factory = async (image) => {
  return await Jimp.read(image.path).then((jimp) => {
    return jimp.autocrop(0.2).resize(512, 512)
  })
}

const rotate = async (image, degrees, output) => {
  await factory(image).then((jimp) => {
    jimp.rotate(degrees).write(`${output}/r(${degrees})-${image.name}`)
  })
}

const mirror = async (image, output) => {
  await factory(image).then((jimp) => {
    jimp.mirror(true, false).write(`${output}/m(h)-${image.name}`)
  })
}

const contrast = async (image, value, output) => {
  await factory(image).then((jimp) => {
    jimp.contrast(value).write(`${output}/c(${value})-${image.name}`)
  })
}

const run = async () => {
  await Promise.all(
    images.map(async (image) => {
      rotate(image, 0, outputDir)
      rotate(image, 45, outputDir)
      rotate(image, -45, outputDir)
      rotate(image, 90, outputDir)
      rotate(image, -90, outputDir)
      rotate(image, 180, outputDir)
      mirror(image, outputDir)
      contrast(image, 0.5, outputDir)
    })
  )
}

run()
