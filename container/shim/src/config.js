import { randomUUID } from 'node:crypto'
import { readFile, writeFile } from 'fs/promises'

const NODE_ID_FILE_PATH = './shared/nodeId.txt'

export const DEV_VERSION = '0_dev'
export const NODE_VERSION = pVersion(process.env.NODE_VERSION || DEV_VERSION)
export const PORT = process.env.SHIM_PORT || 10361
export const NGINX_PORT = process.env.NGINX_PORT || 443
export const SATURN_NETWORK = process.env.SATURN_NETWORK
export const ORCHESTRATOR_URL = process.env.ORCHESTRATOR_URL || networkToOrchestrator()
export const LOG_INGESTOR_URL = process.env.LOG_INGESTOR_URL || networkToIngestor()
export const FIL_WALLET_ADDRESS = process.env.FIL_WALLET_ADDRESS || error('FIL_WALLET_ADDRESS')
export const NODE_OPERATOR_EMAIL = process.env.NODE_OPERATOR_EMAIL || null
export const nodeId = await readFile(NODE_ID_FILE_PATH, 'utf-8').catch(() => false) || createNodeId()

export let nodeToken = ''
export const updateNodeToken = (newToken) => { nodeToken = newToken }

function networkToOrchestrator () {
  switch (SATURN_NETWORK) {
    case 'main': {
      return 'https://orchestrator.strn.pl'
    }
    case 'test': {
      return 'https://orchestrator.saturn-test.network'
    }
    default: {
      return 'http://localhost:10365'
    }
  }
}

function networkToIngestor () {
  switch (SATURN_NETWORK) {
    case 'main': {
      return 'https://twb3qukm2i654i3tnvx36char40aymqq.lambda-url.us-west-2.on.aws/'
    }
    case 'test': {
      return 'https://mytvpqv54yawlsraubdzie5k2m0ggkjv.lambda-url.us-west-2.on.aws/'
    }
    default: {
      return 'http://localhost:10364'
    }
  }
}

function error (requiredVarName) {
  throw new Error(`${requiredVarName} missing in process env`)
}

function pVersion (version) {
  return version.slice(0, version.indexOf('_') + 8)
}

function createNodeId () {
  const newNodeId = randomUUID()
  writeFile(NODE_ID_FILE_PATH, newNodeId).catch(console.error) // eslint-disable-line no-console
  return newNodeId
}
