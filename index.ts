import trier from 'trier-promise';

type UnPromisify<T> = T extends Promise<infer U> ? U : T;
export interface Options {
  timeout?: number;
  interval?: number;
}
const defaults: Options = {
  timeout: 10000,
  interval: 200
}
type aFunction<R> = () => R

function eventually<ReturnValue>(fn: aFunction<ReturnValue>, opts?: Options): Promise<UnPromisify<ReturnValue>> {
  return Promise.resolve().then(() => {
    let error = null
    const action = () => Promise.resolve().then(fn).catch(err => {
      error = err
      throw err
    })
    const options = Object.assign({ action }, defaults, opts)

    return trier(options).catch(() => {
      if (error !== null) {
        error.message = `Timeout of ${options.timeout} ms with: ` + error.message
      }
      throw error
    })
  })
}

export default {
  eventually,
  with: <R>(overrides: Options) => (fn: aFunction<R>, opts: Options) => eventually(fn, Object.assign({}, overrides, opts))
}