import sharp from 'sharp';
import path from 'path';
const getRequestSharp = (server_image_path, filter) => {
  return new Promise(async (resolve, reject) => {
    try {
      console.log(server_image_path, filter);
      if (server_image_path && filter.lastChange == 'grayscale') {
        console.log('works');
        const baseName = path.basename(server_image_path)
        const parsed = path.parse(baseName)
        const fileName = parsed.name
        const fileExtension = parsed.ext.slice(1)
        const directory = path.dirname(server_image_path)
        let meta = await sharp(server_image_path)
          .grayscale()
          .toFile(`${directory}/${fileName}-grayscale.${fileExtension}`)
        resolve(meta)
      }
      else if (server_image_path && filter.lastChange == 'rotate') {
        const baseName = path.basename(server_image_path)
        const parsed = path.parse(baseName)
        const fileName = parsed.name
        const fileExtension = parsed.ext.slice(1)
        const directory = path.dirname(server_image_path)
        let meta = await sharp(server_image_path)
          .rotate(90)
          .toFile(`${directory}/${fileName}-rotated.${fileExtension}`)
        resolve(meta)
      }
      else if (server_image_path && filter.lastChange == 'resize') {
        if (filter.width && filter.height) {
          const baseName = path.basename(server_image_path)
          const parsed = path.parse(baseName)
          const fileName = parsed.name
          const fileExtension = parsed.ext.slice(1)
          const directory = path.dirname(server_image_path)
          let meta = await sharp(server_image_path)
            .resize({
              width: filter.width,
              height: filter.height
            })
            .toFile(`${directory}/${fileName}-resized.${fileExtension}`)
          resolve(meta)
        } else {
          reject('Podaj wysokość i szerokość')
        }
      }
      else if (server_image_path && filter.lastChange == 'reformat') {
        if (filter.format) {
          const baseName = path.basename(server_image_path)
          const parsed = path.parse(baseName)
          const fileName = parsed.name
          const fileExtension = parsed.ext.slice(1)
          const directory = path.dirname(server_image_path)
          let meta = await sharp(server_image_path)
            .toFormat(filter.format)
            .toFile(`${directory}/${fileName}-reformatted.${filter.format}`)
          resolve(meta)
        } else {
          reject('Podaj nowy format')
        }
      }
      else if (server_image_path && filter.lastChange == 'crop') {
        if (filter.width && filter.height) {
          const baseName = path.basename(server_image_path)
          const parsed = path.parse(baseName)
          const fileName = parsed.name
          const fileExtension = parsed.ext.slice(1)
          const directory = path.dirname(server_image_path)
          let meta = await sharp(server_image_path)
            .extract({ width: filter.width, height: filter.height, left: filter.left || 0, top: filter.top || 0, right: filter.right || 0, bottom: filter.bottom || 0 })
            .toFile(`${directory}/${fileName}-cropped.${fileExtension}`)
          resolve(meta)
        } else {
          reject('Podaj wysokość i szerokość')
        }
      }
      else if (server_image_path && filter.lastChange == 'flip') {
        const baseName = path.basename(server_image_path)
        const parsed = path.parse(baseName)
        const fileName = parsed.name
        const fileExtension = parsed.ext.slice(1)
        const directory = path.dirname(server_image_path)
        let meta = await sharp(server_image_path)
          .flip()
          .toFile(`${directory}/${fileName}-flipped.${fileExtension}`)
        resolve(meta)
      }
      else if (server_image_path && filter.lastChange == 'flop') {
        const baseName = path.basename(server_image_path)
        const parsed = path.parse(baseName)
        const fileName = parsed.name
        const fileExtension = parsed.ext.slice(1)
        const directory = path.dirname(server_image_path)
        let meta = await sharp(server_image_path)
          .flop()
          .toFile(`${directory}/${fileName}-flopped.${fileExtension}`)
        resolve(meta)
      }
      else if (server_image_path && filter.lastChange == 'negate') {
        const baseName = path.basename(server_image_path)
        const parsed = path.parse(baseName)
        const fileName = parsed.name
        const fileExtension = parsed.ext.slice(1)
        const directory = path.dirname(server_image_path)
        let meta = await sharp(server_image_path)
          .negate()
          .toFile(`${directory}/${fileName}-negate.${fileExtension}`)
        resolve(meta)
      }
      else if (server_image_path && filter.lastChange == 'tint') {
        if (filter.red && filter.green && filter.blue) {
          const baseName = path.basename(server_image_path)
          const parsed = path.parse(baseName)
          const fileName = parsed.name
          const fileExtension = parsed.ext.slice(1)
          const directory = path.dirname(server_image_path)
          let meta = await sharp(server_image_path)
            .tint({ r: filter.red, g: filter.green, b: filter.blue })
            .toFile(`${directory}/${fileName}-tint.${fileExtension}`)
          resolve(meta)
        } else {
          reject('Podaj kolory')
        }
      }
      else if (server_image_path && !filter.lastChange) {
        let meta = await sharp(server_image_path)
          .metadata()
        resolve(meta)
      }

      else {
        resolve("url_not_found")
      }

    } catch (err) {
      reject(err.mesage)
    }
  })
}
export default getRequestSharp