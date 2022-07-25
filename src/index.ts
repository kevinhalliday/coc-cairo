import {
  workspace,
  commands,
  window,
  Uri,
  ServerOptions,
  LanguageClientOptions,
  ExtensionContext,
  LanguageClient,
  TransportKind,
} from 'coc.nvim'

let client: LanguageClient

export async function activate(context: ExtensionContext) {
  const serverModule =
    workspace.getConfiguration('cairols').get<string>('serverModule') ??
    context.asAbsolutePath('node_modules/cairo-ls/out/server.js')

  const serverOptions: ServerOptions = {
    run: {
      module: serverModule,
      transport: TransportKind.ipc,
    },
    debug: {
      module: serverModule,
      transport: TransportKind.ipc,
      options: {
        execArgv: ['--nolazy', '--inspect=6009'],
      },
    },
  }

  const clientOptions: LanguageClientOptions = {
    documentSelector: [
      'cairo',
      {
        pattern: '**/*.cairo',
        scheme: 'file',
      },
    ],
    synchronize: {
      // Notify the server about file changes to '.cairo files contained in the workspace
      fileEvents: workspace.createFileSystemWatcher('**/*.cairo'),
    },
  }

  registerCommands(context)

  client = new LanguageClient(
    'coc-cairo',
    'coc-cairo',
    serverOptions,
    clientOptions,
  )

  client.start()
}

function join(...args: (string | boolean | null | undefined)[]) {
  return args.filter(s => !!s).join(' ')
}

function call(command: string) {
  window.openTerminal(command, { autoclose: false })
}

async function getCurrentFilename() {
  const doc = await workspace.document
  return Uri.parse(doc.uri).fsPath
}

/**
 * Registers the following commands:
 *
 *  nile.compile      - Compile the current file
 *  nile.compile.all  - Compile all files
 *  nile.clean        - Clean up compilation artifacts
 *  pytest            - Run pytest
 */
function registerCommands(context: ExtensionContext) {
  const config = workspace.getConfiguration('cairols')
  const sourceDir = config.get<string>('sourceDir')
  const nileUseVenv = config.get<boolean>('nileUseVenv')
  const nileVenvCommand = config.get<string>('nileVenvCommand')

  // prefix all calls with nile venv activation
  const commandPrefix =
    nileUseVenv && nileVenvCommand ? join(nileVenvCommand, '&&') : null

  // nile compile takes an optional --directory argument
  const sourceDirParam = sourceDir ? join('--directory', sourceDir) : null

  // > nile compile <filename> - compile a single file
  const compileCommand = (filename: string) =>
    join(commandPrefix, 'nile', 'compile', sourceDirParam, filename)

  // > nile compile - compile all files
  const compileAllCommand = join(
    commandPrefix,
    'nile',
    'compile',
    sourceDirParam,
  )

  // > nile clean - clean compiled contracts
  const cleanCommand = join(commandPrefix, 'nile', 'clean')

  const compile = async () => call(compileCommand(await getCurrentFilename()))
  const compileAll = () => call(compileAllCommand)
  const clean = () => call(cleanCommand)
  const test = () => call('pytest')

  context.subscriptions.push(
    commands.registerCommand('nile.compile', compile),
    commands.registerCommand('nile.compile.all', compileAll),
    commands.registerCommand('nile.clean', clean),
    commands.registerCommand('pytest', test),
  )
}

export async function deactivate() {
  return client?.stop()
}
