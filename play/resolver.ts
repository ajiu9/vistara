
function kebabCase(key: string) {
  const result = key.replace(/([A-Z])/g, ' $1').trim()
  return result.split(' ').join('-').toLowerCase()
}

async function resolveComponent(name: string) {
  console.log('name: ', name)
  if (!name.match(/^El[A-Z]/))
    return

  return {
    name,
    from: `@vistara/components`,
  }
}

export function VistaraResolver() {
  return [
    {
      type: 'component',
      resolve: async (name: string) => {
        return await resolveComponent(name)
      },
    }
  ] 
}
