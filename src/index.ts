import dns, { resolveMx } from "dns";
import { promisify } from "util";

// Export this for testing purposes
export const dnsResolveMx = promisify(dns.resolveMx);

/**
 * MX check result
 */
export interface MxCheckResult {
  domain: string;
  hasMx: boolean;
  mxRecords?: dns.MxRecord[];
  error?: string;
}

/**
 * Options for MX checking
 */
export interface MxCheckOptions {
  /**
   * Timeout in milliseconds for DNS lookups
   * @default 5000
   */
  timeout?: number;
}

/**
 * Helper function to get MX records with a timeout
 * @param domain Domain to check
 * @param timeout Timeout in milliseconds for DNS lookups
 * @returns Promise resolving to MX records or rejecting with an error
 */
function getMXRecordsPromise(domain: string, timeout = 5000) {
  return new Promise((resolve, reject) => {
    const timeoutId = setTimeout(() => {
      reject(new Error("Timeout reached while fetching MX records"));
    }, timeout);

    dns.resolveMx(domain, (err, addresses) => {
      clearTimeout(timeoutId);
      if (err) {
        reject(err);
      } else {
        resolve(addresses);
      }
    });
  });
}

/**
 * Checks if a domain has MX records and returns the list of MX records
 * @param domain Domain to check
 * @param options Check options
 * @returns Promise resolving to MX check result
 */
export async function checkMx(
  domain: string,
  options: MxCheckOptions = {}
): Promise<MxCheckResult> {
  const { timeout = 5000 } = options;

  try {
    // Race the DNS lookup against the timeout
    const mxRecords = (await getMXRecordsPromise(
      domain,
      timeout
    )) as dns.MxRecord[];

    return {
      domain,
      hasMx: mxRecords.length > 0,
      mxRecords: mxRecords,
    };
  } catch (error) {
    return {
      domain,
      hasMx: false,
      mxRecords: [],
      error: error instanceof Error ? error.message : String(error),
    };
  }
}