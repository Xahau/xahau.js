// replaceScript.ts

// @ts-ignore -- No types available for fs/promises
import * as fs from "fs/promises";
// @ts-ignore -- No types available for fs/promises
import * as path from "path";

// Constants
const rippleDocker: string = "rippleci/rippled:2.2.0-b3";
const xahauDocker: string = "xahauci/xahaud:2024.9.11";

/**
 * Replace text in a file with the given replacements.
 * @param filePath - Path to the file.
 * @param replacements - Object with key-value pairs for replacement.
 */
async function replaceTextInFile(
  filePath: string,
  replacements: { [key: string]: string }
): Promise<void> {
  try {
    let content = await fs.readFile(filePath, "utf-8");
    for (const [key, value] of Object.entries(replacements)) {
      const regex = new RegExp(escapeRegExp(key), "g");
      content = content.replace(regex, value);
    }
    await fs.writeFile(filePath, content, "utf-8");
    console.log(`Updated: ${filePath}`);
  } catch (error) {
    console.error(
      `Error processing file ${filePath}: ${(error as Error).message}`
    );
  }
}

/**
 * Escape special characters for use in RegExp.
 * @param string - The string to escape.
 * @returns The escaped string.
 */
function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Replace occurrences in pyproject.toml, specifically in the [tool.poetry] authors section.
 * @param filePath - Path to pyproject.toml.
 * @param newAuthors - Array of new authors to add.
 */
// async function replaceInPoetry(filePath: string, newAuthors: string[]): Promise<void> {
//     try {
//         let content = await fs.readFile(filePath, 'utf-8');

//         // Replace specific texts
//         const replacements: { [key: string]: string } = {
//             "https://github.com/XRPLF/xrpl-py": "https://github.com/Xahau/xahau-py",
//             "xrpl": "xahau",
//             "xrp": "xah",
//             "XRP ledger": "Xahau Ledger",
//         };

//         await replaceTextInFile(filePath, replacements);

//         // Handle authors separately
//         content = await fs.readFile(filePath, 'utf-8');
//         const authorsRegex = /^authors\s*=\s*\[(.*?)\]/ms;
//         const match = authorsRegex.exec(content);
//         if (match) {
//             const existingAuthors = match[1]
//                 .split(',')
//                 .map(author => author.trim().replace(/"/g, ''))
//                 .filter(author => author);
//             const combinedAuthors = [...existingAuthors, ...newAuthors.map(author => author.trim())];
//             const newAuthorsList = combinedAuthors.map(author => `  "${author}"`).join(',\n  ');
//             const newAuthorsSection = `authors = [\n${newAuthorsList}\n]`;
//             content = content.replace(authorsRegex, newAuthorsSection);
//             await fs.writeFile(filePath, content, 'utf-8');
//             console.log(`Updated authors in: ${filePath}`);
//         } else {
//             console.warn(`Authors section not found in: ${filePath}`);
//         }
//     } catch (error) {
//         console.error(`Error processing file ${filePath}: ${(error as Error).message}`);
//     }
// }

/**
 * Replace text in README.md.
 * @param filePath - Path to README.md.
 */
async function replaceInReadme(filePath: string): Promise<void> {
  const replacements: { [key: string]: string } = {
    "from xrpl": "from xahau",
    "xrpl-py": "xahau-py",
    "xrpl.": "xahau.",
    "xrpl-announce": "xahau-announce",
    "xrpl-keypairs": "xahau-keypairs",
    "XRP Ledger": "Xahau Ledger",
    "https://s.altnet.rippletest.net:51234": "https://xahau-test.net",
  };
  await replaceTextInFile(filePath, replacements);
}

async function replaceInUnique(filePath: string): Promise<void> {
  const replacements: { [key: string]: string } = {
    "Xrpl.js": "Xahau.js",
    xrpl: "xahau",
    "wss://s.altnet.rippletest.net:51233": "wss://xahau-test.net",
  };
  await replaceTextInFile(filePath, replacements);
}

/**
 * Replace text in CONTRIBUTING.md or other contributing files.
 * @param filePath - Path to the contributing file.
 */
async function replaceInContrib(filePath: string): Promise<void> {
  const replacements: { [key: string]: string } = {
    "xrpl.js": "xahau.js",
    "xrpl-announce": "xahau-announce",
    [rippleDocker]: xahauDocker,
    "/opt/ripple/bin/rippled": "/opt/xahau/bin/xahaud",
    "/opt/ripple/etc/rippled.cfg": "/opt/xahau/etc/xahaud.cfg",
    ripple: "xahau",
    rippled: "xahaud",
    RIPPLED: "XAHAUD",
    getXRPBalance: "getXAHBalance",
    "/packages/xrpl": "/packages/xahau",
    "`xrpl`": "`xahau`",
    "-w xrpl": "-w xahau",
    "xrpl-py": "xahau-py",
    "xrpl@beta": "xahau@beta",
    "`xrpl@2.1.1`": "`xahau@2.1.1`",
    "xrpl libraries": "xahau libraries",
    "XRP Ledger": "Xahau Ledger",
    "XRPL Discord": "Xahau Discord",
    "https://discord.com/channels/886050993802985492/886053111179915295":
      "https://discord.com/channels/1085202760548499486/1085203623111295068",
  };
  await replaceTextInFile(filePath, replacements);
}

/**
 * Replace text in CONTRIBUTING.md or other contributing files.
 * @param filePath - Path to the contributing file.
 */
async function replaceInConfig(filePath: string): Promise<void> {
  const replacements: { [key: string]: string } = {
    "[validators_file]": "# [validators_file]",
    "validators.txt": "# validators.txt",
  };
  await replaceTextInFile(filePath, replacements);
}

/**
 * Replace text in GitHub workflow and config files.
 * @param filePath - Path to the GitHub-related file.
 */
async function replaceInGitHub(filePath: string): Promise<void> {
  const replacements: { [key: string]: string } = {
    "[xahau]": "[main, xahau]",
    "flake8 xrpl": "flake8 xahau",
    "reexport xrpl": "reexport xahau",
    "xrpl/": "xahau/",
    "source xrpl": "source xahau",
  };
  await replaceTextInFile(filePath, replacements);
}

/**
 * Replace text in generic Python or JSON files.
 * @param filePath - Path to the file.
 */
async function replaceInPackage(filePath: string): Promise<void> {
  const replacements: { [key: string]: string } = {
    '"xrpl.js"': '"xahau.js"',
    '"xrpl"': '"xahau"',
    '"ripple-address-codec"': '"xahau-address-codec"',
    '"ripple-binary-codec"': '"xahau-binary-codec"',
    '"ripple-keypairs"': '"xahau-keypairs"',
    '"file:packages/ripple-address-codec"':
      '"file:packages/xahau-address-codec"',
    '"file:packages/ripple-binary-codec"': '"file:packages/xahau-binary-codec"',
    '"file:packages/ripple-keypairs"': '"file:packages/xahau-keypairs"',
    '"file:packages/xrpl"': '"file:packages/xahau"',
  };
  await replaceTextInFile(filePath, replacements);
}

/**
 * Replace text in generic Python or JSON files.
 * @param filePath - Path to the file.
 */
async function replaceInIsomorphic(filePath: string): Promise<void> {
  const replacements: { [key: string]: string } = {
    '"git@github.com:XRPLF/xrpl.js.git"':
      '"git@github.com:Xahaud/xahau.js.git"',
    '"xrpl.js"': '"xahau.js"',
  };
  await replaceTextInFile(filePath, replacements);
}

/**
 * Replace text in generic Python or JSON files.
 * @param filePath - Path to the file.
 */
async function replaceInFile(filePath: string): Promise<void> {
  const replacements: { [key: string]: string } = {
    "from 'xrpl'": "from 'xahau'",
    '"xrpl"': '"xahau"',
    '"ripple-address-codec"': '"xahau-address-codec"',
    '"ripple-binary-codec"': '"xahau-binary-codec"',
    '"ripple-keypairs"': '"xahau-keypairs"',
    "from xrpl": "from xahau",
    "from './xrp-codec'": "from './xah-codec'",
    "from './enums/xrpl-definitions'": "from './enums/xahau-definitions'",
    "from '../src/enums/xrpl-definitions'":
      "from '../src/enums/xahau-definitions'",
    "from './xrpl-definitions-base'": "from './xahau-definitions-base'",
    "from './fixtures/rippled'": "from './fixtures/xahaud'",
    "`fixtures/rippled/": "`fixtures/xahaud/",
    "from 'ripple-address-codec'": "from 'xahau-address-codec'",
    "from 'ripple-binary-codec'": "from 'xahau-binary-codec'",
    "from 'ripple-binary-codec/dist/types'":
      "from 'xahau-binary-codec/dist/types'",
    "from 'ripple-keypairs'": "from 'xahau-keypairs'",
    "from '../fixtures/rippled'": "from '../fixtures/xahaud'",
    "from '../fixtures/rippled/accountLines'":
      "from '../fixtures/xahaud/accountLines'",
    '"rootDir": "../../xrpl"': '"rootDir": "../../xahau"',
    "../ripple-address-codec/tsconfig.json":
      "../xahau-address-codec/tsconfig.json",
    "../ripple-binary-codec/tsconfig.json":
      "../xahau-binary-codec/tsconfig.json",
    "../ripple-keypairs/tsconfig.json": "../xahau-keypairs/tsconfig.json",
    "../ripple-address-codec/tsconfig.build.json":
      "../xahau-address-codec/tsconfig.build.json",
    "../ripple-binary-codec/tsconfig.build.json":
      "../xahau-binary-codec/tsconfig.build.json",
    "../ripple-keypairs/tsconfig.build.json":
      "../xahau-keypairs/tsconfig.build.json",
    "./getFeeXrp": "./getFeeXah",
    "../../src/sugar/getFeeXrp": "../../src/sugar/getFeeXah",
    "xrpl-announce": "xahau-announce",
    "wss://s.altnet.rippletest.net:51233": "wss://xahau-test.net",
    "wss://s.devnet.rippletest.net": "wss://jshooks.xahau-test.net",
    "wss://testnet.xrpl-labs.com": "wss://xahau-test.net",
    // "XRP": "XAH",
    xrpToDrops: "xahToDrops",
    dropsToXrp: "dropsToXah",
    xrpConversion: "xahConversion",
    XrplError: "XahlError",
    RippledError: "XahaudError",
    RippledNotInitializedError: "XahaudNotInitializedError",
    XRPLFaucetError: "XAHLFaucetError",
    '"xrp"': '"xah"',
    '"xrpl-ledger"': '"xahau-ledger"',
    '"xrp ledger"': '"xahau ledger"',
    '"ripple",': '"xahau",',
    "faucet.altnet.rippletest.net": "xahau-test.net/accounts",
    "faucet.devnet.rippletest.net": "jshooks.xahau-test.net/accounts",
    "0000000000000000000000005852500000000000":
      "0000000000000000000000005841480000000000",
    RIPPLED_API_V2: "XAHAUD_API_V2",
    RIPPLED_API_V1: "XAHAUD_API_V1",
    "export const DEFAULT_API_VERSION = XAHAUD_API_V2":
      "export const DEFAULT_API_VERSION = XAHAUD_API_V1",
    "api_version: 2,": "api_version: 1,",
    "'XRP'": "'XAH'",
  };
  // const replacements: { [key: string]: string } = {
  //     "from xrpl": "from xahau",
  //     "import xrpl": "import xahau",
  //     "xrpl.utils": "xahau.utils",
  //     "xrpl.models.": "xahau.models.",
  //     "xrpl.core.": "xahau.core.",
  //     "flake8 xrpl": "flake8 xahau",
  //     "xrpl-announce": "xahau-announce",
  //     "../xrpl": "../xahau",
  //     "xrpllabsofficial/xrpld:1.12.0": "xahaulabsofficial/xahaud:1.12.0",
  //     "xrpl-py": "xahau-py",
  //     "https://s.altnet.rippletest.net:51234": "https://xahau-test.net",
  //     "https://xrplcluster.com/": "https://xahau.network",
  //     '_TEST_FAUCET_URL: Final[str] = "https://faucet.altnet.rippletest.net/accounts"':
  //         '_TEST_FAUCET_URL: Final[str] = "https://xahau-test.net/accounts"',
  //     '_DEV_FAUCET_URL: Final[str] = "https://faucet.devnet.rippletest.net/accounts"':
  //         '_DEV_FAUCET_URL: Final[str] = "https://xahau-test.net/accounts"',
  //     'if "altnet" in url or "testnet" in url:':
  //         'if "xahau-test" in url or "testnet" in url:',
  //     "https://s.devnet.rippletest.net:51234": "https://xahau-test.net",
  //     "wss://s.altnet.rippletest.net:51233": "wss://xahau-test.net",
  //     "wss://s.devnet.rippletest.net": "wss://xahau-test.net",
  //     "https://testnet.xrpl-labs.com": "https://xahau-test.net",
  //     "wss://testnet.xrpl-labs.com": "wss://xahau-test.net",
  //     "faucet.devnet.rippletest.net": "xahau-test.net",
  //     "wss://xahau-test.net:51233": "wss://xahau-test.net",
  //     '_DEFAULT_API_VERSION: Final[int] = 2': '_DEFAULT_API_VERSION: Final[int] = 1',
  //     '"xrpl.': '"xahau.',
  //     "XRP": "XAH",
  //     "xrp_to_drops": "xah_to_drops",
  //     "drops_to_xrp": "drops_to_xah",
  //     "xrp_conversions": "xah_conversions",
  //     // "XAHLModelException": "XRPLModelException", // Commented out as in Python
  //     "XRPLModelException": "XAHLModelException",
  //     "xahau.models.currencies.xrp": "xahau.models.currencies.xah",
  //     '"xrp"': '"xah"',
  //     "0000000000000000000000005852500000000000": "0000000000000000000000005841480000000000",
  //     "def test_does_account_exist_throws_for_invalid_account":
  //         "def _test_does_account_exist_throws_for_invalid_account",
  //     "def test_run_faucet_tests": "def _test_run_faucet_tests",
  //     // Additional replacements commented out as in Python
  //     // "TestAccountDelete": "NoTestAccountDelete",
  //     // "TestAMM": "NoTestAMM",
  //     // "TestClawback": "NoTestClawback",
  //     // "TestDeleteOracle": "NoTestDeleteOracle",
  //     // "TestDID": "NoTestDID",
  //     // "TestSetOracle": "NoTestSetOracle",
  //     // "TestXChain": "NoTestXChain",
  //     // "TestFeature": "NoTestFeature",
  // };
  await replaceTextInFile(filePath, replacements);
}

/**
 * Search for Python and JSON files in the given folders and perform replacements.
 * @param folderPaths - Array of folder paths to search.
 */
async function searchAndReplaceInFolders(folderPaths: string[]): Promise<void> {
  for (const folderPath of folderPaths) {
    try {
      const entries = await fs.readdir(folderPath, { withFileTypes: true });
      for (const entry of entries) {
        const fullPath = path.join(folderPath, entry.name);
        if (entry.isDirectory()) {
          await searchAndReplaceInFolders([fullPath]);
        } else if (
          entry.isFile() &&
          (fullPath.endsWith(".ts") ||
            fullPath.endsWith(".js") ||
            fullPath.endsWith(".json"))
        ) {
          await replaceInFile(fullPath);
        }
      }
    } catch (error) {
      console.error(
        `Error reading folder ${folderPath}: ${(error as Error).message}`
      );
    }
  }
}

/**
 * Rename a folder or file.
 * @param oldName - Current name/path.
 * @param newName - New name/path.
 */
async function renameItem(oldName: string, newName: string): Promise<void> {
  try {
    await fs.rename(oldName, newName);
    console.log(`Renamed ${oldName} to ${newName}`);
  } catch (error) {
    console.error(
      `Error renaming ${oldName} to ${newName}: ${(error as Error).message}`
    );
  }
}

/**
 * Delete a file.
 * @param fileName - Path to the file to delete.
 */
async function deleteFile(fileName: string): Promise<void> {
  try {
    await fs.unlink(fileName);
    console.log(`Deleted file: ${fileName}`);
  } catch (error) {
    console.error(
      `Error deleting file ${fileName}: ${(error as Error).message}`
    );
  }
}

/**
 * Main function to execute all operations.
 */
async function main() {
  // Delete Files
  // await deleteFile("APPLICATIONS.md")
  // Renaming folders/files
  // await renameItem("packages/xrpl", "packages/xahau");
  // await renameItem("packages/ripple-address-codec", "packages/xahau-address-codec");
  // await renameItem("packages/ripple-binary-codec", "packages/xahau-binary-codec");
  // await renameItem("packages/ripple-keypairs", "packages/xahau-keypairs");
  // await renameItem(".ci-config/rippled.cfg", ".ci-config/xahaud.cfg");
  // await renameItem("packages/xahau/src/utils/xrpConversion.ts", "packages/xahau/src/utils/xahConversion.ts");
  // await renameItem("packages/xahau/test/utils/xrpToDrops.ts", "packages/xahau/test/utils/xahToDrops.ts");
  // await renameItem("packages/xrpl/test/client/getFeeXrp.test.ts", "packages/xrpl/test/client/getFeeXah.test.ts");
  // await renameItem("packages/xrpl/test/client/getXahBalance.test.ts", "packages/xrpl/test/client/getXahBalance.test.ts")
  // await renameItem("packages/xahau/src/sugar/getFeeXrp.ts", "packages/xahau/src/sugar/getFeeXah.ts")
  // await renameItem("packages/xahau/test/fixtures/rippled", "packages/xahau/test/fixtures/xahaud")
  // // Address Codec
  // await renameItem("packages/xahau-address-codec/src/xrp-codec.ts", "packages/xahau-address-codec/src/xah-codec.ts");
  // await renameItem("packages/xahau-address-codec/test/xrp-codec.test.ts", "packages/xahau-address-codec/test/xah-codec.test.ts");

  // // Binary Codec
  // await renameItem("packages/xahau-binary-codec/src/enums/xrpl-definitions-base.ts", "packages/xahau-binary-codec/src/enums/xahau-definitions-base.ts");
  // await renameItem("packages/xahau-binary-codec/src/enums/xrpl-definitions.ts", "packages/xahau-binary-codec/src/enums/xahau-definitions.ts");

  await replaceInIsomorphic("package.json");
  await replaceInPackage("package.json");
  // // Search and replace in specified folders
  const folderList: string[] = ["packages"];
  await searchAndReplaceInFolders(folderList);

  // await replaceInUnique("UNIQUE_SETUPS.md");

  // // Perform replacements in specific files
  await replaceInConfig(".ci-config/xahaud.cfg");
  await replaceInContrib("CONTRIBUTING.md");
  // await replaceInGitHub(".github/workflows/integration_test.yml");
  // await replaceInGitHub(".github/workflows/unit_test.yml");
  // await replaceInGitHub(".pre-commit-config.yaml");

  // // Uncomment and use if needed
  // // await replaceInPoetry(
  // //     "pyproject.toml",
  // //     ["Denis Angell <denis@xrpl-labs.com>", "Tequ <tequ@xrplf.com>"],
  // // );

  // await replaceInReadme("README.md");

  // // Delete a specific file
  // await deleteFile(".github/workflows/snippet_test.yml");
}

// Execute the main function
main().catch((error) => {
  console.error(`Unexpected error: ${(error as Error).message}`);
});
