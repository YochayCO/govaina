export async function catchError<T>(promise: Promise<T>): Promise<[Error] | [undefined, T]> {
  return promise
    .then(async (data: T) => {
      try {
        const response = data as Response
        if (response.status >= 400) {
          const errMessage = await response.text()
          return [new Error(`Server responded with status ${response.status} and message: ${errMessage}`)] as [Error]
        }
      } catch {
        return [new Error(`Got a bad response type: ${data}`)] as [Error]
      }
      return [undefined, data] as [undefined, T]
    })
    .catch((error: Error) => [error])
}
