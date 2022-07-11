import path from 'path'
import {
  services,
  ServerOptions,
  LanguageClientOptions,
  ExtensionContext,
  LanguageClient,
} from 'coc.nvim'

export async function activate(context: ExtensionContext): Promise<void> {
  const serverOptions: ServerOptions = {
    module: path.join(
      path.dirname(__dirname),
      'node_modules/cairo-ls/out/server.js',
    ),
  }

  const clientOptions: LanguageClientOptions = {
    documentSelector: ['cairo'],
  }

  const client = new LanguageClient(
    'coc-cairo', // the id
    'coc-cairo', // the name of the language server
    serverOptions,
    clientOptions,
  )

  context.subscriptions.push(services.registLanguageClient(client))
}
