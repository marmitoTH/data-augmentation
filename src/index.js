const fs = require('fs')
const Jimp = require('jimp')

const inputDir = process.argv[2]
const outputDir = process.argv[3]

const names = fs.readdirSync(inputDir)
const images = names.map((name) => ({
  name,
  path: `${inputDir}/${name}`
}))

const factory = async (image) => {
  return await Jimp.read(image.path).then((jimp) => {
    return jimp.autocrop(0.3).resize(512, 512)
  })
}

const rotate = async (image, degrees, output) => {
  await factory(image).then((jimp) => {
    jimp.rotate(degrees).write(`${output}/r(${degrees})-${image.name}`)
  })
}

const mirrorX = async (image, output) => {
  await factory(image).then((jimp) => {
    jimp.mirror(true, false).write(`${output}/m(h)-${image.name}`)
  })
}

const mirrorY = async (image, output) => {
  await factory(image).then((jimp) => {
    jimp.mirror(false, true).write(`${output}/m(v)-${image.name}`)
  })
}

const brightness = async (image, value, output) => {
  await factory(image).then((jimp) => {
    jimp.brightness(value).write(`${output}/bt(${value})-${image.name}`)
  })
}

const contrast = async (image, value, output) => {
  await factory(image).then((jimp) => {
    jimp.contrast(value).write(`${output}/c(${value})-${image.name}`)
  })
}

const blur = async (image, value, output) => {
  await factory(image).then((jimp) => {
    jimp.blur(value).write(`${output}/b(${value})-${image.name}`)
  })
}

const run = async () => {
  await Promise.all(
    images.map(async (image) => {
      await rotate(image, 0, outputDir)
      await rotate(image, 45, outputDir)
      await rotate(image, -45, outputDir)
      await rotate(image, 90, outputDir)
      await rotate(image, -90, outputDir)
      await rotate(image, 180, outputDir)
      await mirrorX(image, outputDir)
      await mirrorY(image, outputDir)
      await contrast(image, 0.5, outputDir)
      await contrast(image, -0.5, outputDir)
      await blur(image, 3, outputDir)
      await brightness(image, 0.5, outputDir)
      await brightness(image, -0.5, outputDir)
    })
  )
}

run()
