import path from 'path'
import fs from 'fs'
import { glob } from 'glob'
import { src, dest, watch, series, parallel } from 'gulp'
import * as dartSass from 'sass'
import gulpSass from 'gulp-sass'
import terser from 'gulp-terser'
import sharp from 'sharp'

const sass = gulpSass(dartSass)

const paths = {
    scss: 'src/scss/**/*.scss',
    js: 'src/js/**/*.js'
}

// Return stream instead of using done callback
export function css() {
    return src(paths.scss, { sourcemaps: true })
        .pipe(sass({
            outputStyle: 'compressed'
        }).on('error', sass.logError))
        .pipe(dest('./public/build/css', { sourcemaps: '.' }));
}

// Return stream instead of using done callback
export function js() {
    return src(paths.js)
        .pipe(terser())
        .pipe(dest('./public/build/js'))
}

// Make async and await image processing
export async function imagenes() {
    const srcDir = './src/img';
    const buildDir = './public/build/img';
    const images = await glob('./src/img/**/*');

    const promises = images.map(file => {
        const relativePath = path.relative(srcDir, path.dirname(file));
        const outputSubDir = path.join(buildDir, relativePath);
        return procesarImagenes(file, outputSubDir);
    });
    await Promise.all(promises);
}

// Return promises from image processing
function procesarImagenes(file, outputSubDir) {
    if (!fs.existsSync(outputSubDir)) {
        fs.mkdirSync(outputSubDir, { recursive: true })
    }
    const baseName = path.basename(file, path.extname(file))
    const extName = path.extname(file)

    if (extName.toLowerCase() === '.svg') {
        const outputFile = path.join(outputSubDir, `${baseName}${extName}`);
        fs.copyFileSync(file, outputFile);
        return Promise.resolve(); // Return a resolved promise for SVG
    } else {
        const outputFile = path.join(outputSubDir, `${baseName}${extName}`);
        const outputFileWebp = path.join(outputSubDir, `${baseName}.webp`);
        const outputFileAvif = path.join(outputSubDir, `${baseName}.avif`);
        const options = { quality: 80 };

        // Return a promise that resolves when all images are processed
        return Promise.all([
            sharp(file).jpeg(options).toFile(outputFile),
            sharp(file).webp(options).toFile(outputFileWebp),
            sharp(file).avif().toFile(outputFileAvif)
        ]);
    }
}

export function dev() {
    watch(paths.scss, css);
    watch(paths.js, js);
    watch('src/img/**/*.{png,jpg}', imagenes)
}

// Use parallel for build, then series for watch
export default series( js, css, imagenes, dev);
