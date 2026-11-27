/**
 * Netlify build plugin (declared in netlify.toml): keeps Hugo's resource cache between builds, so a deploy
 * encodes only the images that changed instead of every WebP variant of the site.
 *
 * resources/_gen holds the processed images, named after their source and processing options, so a cached file
 * never goes stale; `hugo --gc` deletes the ones no page uses any more, so the cache does not grow.
 */
const CACHE_DIR = 'resources'

export const onPreBuild = async ({ utils }) => {
    const restored = await utils.cache.restore(CACHE_DIR)
    console.log(restored ? `Restored ${CACHE_DIR}/ from the build cache` : `No ${CACHE_DIR}/ in the build cache yet`)
}

export const onPostBuild = async ({ utils }) => {
    const saved = await utils.cache.save(CACHE_DIR)
    console.log(saved ? `Saved ${CACHE_DIR}/ to the build cache` : `Nothing to save from ${CACHE_DIR}/`)
}
