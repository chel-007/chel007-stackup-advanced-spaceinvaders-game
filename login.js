import { ethers, getDefaultProvider } from "./libs/ethers-5.6.2.esm.min.js";
//import { config, blockchainData } from '@imtbl/sdk';

window.provider = window.passport.connectEvm();

const connectPassport = async function(callback) {
  window.accounts = await window.provider.request({ method: "eth_requestAccounts" });
  console.log(window.accounts)
  if (window.accounts) {
    getUserInfo();
    // Execute the callback function after the connection is established
    if (callback && typeof callback === 'function') {
      callback();
    }
  }
}




const config = {
  baseConfig: new window.immutable.config.ImmutableConfiguration({
    environment: window.immutable.config.Environment.SANDBOX,
  }),
};

const client = new window.immutable.blockchainData.BlockchainData(config);

const getUserInfo = async function(){
    window.userProfile = await window.passport.getUserInfo();
}

const passportLogout = async function(){
    let logout = await window.passport.logout();
    console.log(logout, "logout");
    window.userProfile = {};
}
// Insert Contract Address
const CONTRACT_ADDRESS = '0x9d2498974e6337292e0dc239502f6aa310954c1a';
const CONTRACT_ADDRESS2 = '0xcc21556b1b08e76bdbfbd5220c24c12723d0e540';
const PRIVATE_KEY = '6c0db95a49f823e7bb99de6b214c95bd7dc163907280a36a32abed1932cc07f0';


const CONTRACT_ABI = [
  'function grantRole(bytes32 role, address account)',
  'function MINTER_ROLE() view returns (bytes32)',
  'function mint(address to, uint256 tokenId)',
  'function ownerOf(uint256 tokenId) view returns (address)',
  'function hasRole(bytes32 role, address account) view returns (bool)',
  'function totalSupply() view returns (uint256)'
];

async function getData(id) {
  try {
    let nft = document.getElementById("extras");

    const nftDetails = {
      '0': {
        image: 'https://magenta-golden-kangaroo-945.mypinata.cloud/ipfs/QmaJhsTGfVFsA848Yeey1JeF7ALLnx2LVAU5mkqKT1n7fz/',
        name: 'Alienator Powerup NFT',
        description: 'This NFT grants you an advanced Powerup that you can use in chel007 X Stackup SpaceInvaders'
      },
      '1': {
        image: 'https://bafkreigugjgtcvkwg7ym7uk5ic65wmtkmbngonaj3twzl3nttuj5w7zjku.ipfs.nftstorage.link/',
        name: 'Level 3 Badge - Alien Tropper',
        description: 'This NFT represents your first accomplishment on Chel X StackUp Invaders which grants you a LVL 3 Checkpoint.'
      },
      '2': {
        image: 'https://bafkreifxbz53txersuyqok75dmdhyrnfkascznytyvum2i25bunii5dih4.ipfs.nftstorage.link/',
        name: 'Level 5 Badge - Alien Maestro',
        description: 'This NFT represents your second accomplishment on Chel X StackUp Invaders which grants you an upgraded spaceship and LVL 5 Checkpoint.'
      },
      '3': {
        image: 'https://magenta-golden-kangaroo-945.mypinata.cloud/ipfs/QmRxjn33h1WLLsst1B2UaaChFUWqsrxAUCpK5vigtuuzM6/',
        name: 'Level 8 Badge - Alien Commander',
        description: 'This NFT represents your third accomplishment on Chel X StackUp Invaders which grants you a LVL 8 Checkpoint.'
      },
      '4': {
        image: 'https://magenta-golden-kangaroo-945.mypinata.cloud/ipfs/QmfN86n98zwr9YzZN7RVHtJB75wGw7Ei51v3EjD77xg6af/',
        name: 'Level 10 Badge - Extraterrestrial Ace',
        description: 'This NFT represents your final accomplishment on Chel X StackUp Invaders which grants you a LVL 10 Checkpoint.'
      }
    };

    const details = nftDetails[id.toString()];

    if (!details) {
      throw new Error("Invalid Token ID");
    }

    let alertMessage, cardTextMessage;

    // Set alert and card text messages based on ID
    if (id === '0') {
      alertMessage = "Great Game! You can Claim a Powerup now, then resume the game.";
      cardTextMessage = "NB: Claim NFT Powerup to Activate During Gameplay!. Your Powerup will go into Cooldown after Activation";
    } else {
      alertMessage = "Great Game! You can Claim an NFT now, then resume the game.";
      cardTextMessage = "NB: Claim NFT Now to Earn a LVL Checkpoint for Later!";
    }

    nft.innerHTML = `
      <div class="alert alert-success">${alertMessage}</div>
      <div class="card">
        <div class="card-body">
          <div class="media">
            <img src='${details.image}' class="mr-3 img-thumbnail" alt="nft" style="width: 30%;">
            <div class="media-body">
              <h5 class="card-title">${details.name}</h5>
              <p class="card-text">${details.description}</p>
              <p class="card-text">${cardTextMessage}</p>
            </div>
          </div>
        </div>
        <div class="card-body">
          <button id="claim-btn" class="btn btn-success">Claim</button>
        </div>
      </div>
    `;

    const claimBtn = this.document.getElementById('claim-btn');
    claimBtn.onclick = async function () {
      if (id === '1') {
        await mintNft();
      } else if (id === '0') {
        await mintPowerup();
      } else if (id === '2' || id === '3' || id === '4') {

        const tokenId = await getTokenIdByNftName();
        // Pass different metadata based on the ID
        const metadata = {
          name: `Level ${id === '2' ? '5' : id === '3' ? '8' : '10'} Badge - ${id === '2' ? 'Alien Maestro' : id === '3' ? 'Alien Commander' : 'Level 10 Badge - Extraterrestrial Ace'}`,
          description: `This NFT represents your ${id === '2' ? 'second' : id === '3' ? 'third' : 'final'} accomplishment on StackUp Invaders which grants you a LVL ${id === '2' ? '5' : id === '3' ? '8' : '10'} Checkpoint`,
          image: getImageUrlForId(id), // Function to get the image URL based on the ID
          external_url: 'https://some-url',
          animation_url: 'https://some-url',
          youtube_url: 'https://some-url',
          attributes: [{
            trait_type: 'Level',
            value: 'Basic'
          }],
          token_id: tokenId
        };
    
        await refreshNFTMetadata(metadata);
      }
    }
  } catch (error) {
    console.error(error);
    alert(error);
  }
}

const getTokenIdByNftName = async function () {
  if (window?.provider) {
    const chainName = 'imtbl-zkevm-testnet';
    const provider = new ethers.providers.Web3Provider(window.provider);
    const signer = provider.getSigner();
    const accountAddress = await signer.getAddress();
    console.log(accountAddress);
    const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

    try {
      const response = await client.listNFTsByAccountAddress({
        chainName,
        accountAddress,
        CONTRACT_ADDRESS,
      });

    const ownedNFTs = response.result || [];

    // Check if the user owns any NFT
    if (ownedNFTs.length > 0) {
      console.log(ownedNFTs)
      // Return the token ID of the first owned NFT
      return ownedNFTs[0].token_id;
      
    }
  }
  catch (error) {
    console.log(error);
  }

}

  // Return null if no NFTs are owned or an error occurs
  return null;
};


    


window.getData = getData;
const grantMinterRole = async (recipientAddress) => {
    try {
      const provider = getDefaultProvider("https://rpc.testnet.immutable.com");
      const adminWallet = new ethers.Wallet(PRIVATE_KEY, provider);
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, adminWallet);
  
      const minterRole = await contract.MINTER_ROLE();
  
      const currentGasPrice = await provider.getGasPrice();
      const adjustedGasPrice = currentGasPrice.add(ethers.utils.parseUnits('10', 'gwei'));
      const tx = await contract.grantRole(minterRole, recipientAddress, {
        gasPrice: adjustedGasPrice, 
      });
  
      await tx.wait();
      console.log("Minter Role Granted to", recipientAddress);
    } catch (e) {
      console.error("Error in granting minter role:", e);
    }
  };

  const grantPowerupMinterRole = async (recipientAddress) => {
    try {
      const provider = getDefaultProvider("https://rpc.testnet.immutable.com");
      const adminWallet = new ethers.Wallet(PRIVATE_KEY, provider);
      const contract = new ethers.Contract(CONTRACT_ADDRESS2, CONTRACT_ABI, adminWallet);
  
      const minterRole = await contract.MINTER_ROLE();
  
      const currentGasPrice = await provider.getGasPrice();
      const adjustedGasPrice = currentGasPrice.add(ethers.utils.parseUnits('10', 'gwei'));
      const tx = await contract.grantRole(minterRole, recipientAddress, {
        gasPrice: adjustedGasPrice, 
      });
  
      await tx.wait();
      console.log("Minter Role Granted to", recipientAddress);
    } catch (e) {
      console.error("Error in granting minter role:", e);
    }
  };
  // Function to get the image URL based on the ID
function getImageUrlForId(id) {
  switch (id) {
    case '2':
      return 'https://bafkreifxbz53txersuyqok75dmdhyrnfkascznytyvum2i25bunii5dih4.ipfs.nftstorage.link/'; // Replace with the actual image URL for ID 2
    case '3':
      return 'https://magenta-golden-kangaroo-945.mypinata.cloud/ipfs/QmRxjn33h1WLLsst1B2UaaChFUWqsrxAUCpK5vigtuuzM6'; // Replace with the actual image URL for ID 3
    case '4':
      return 'https://magenta-golden-kangaroo-945.mypinata.cloud/ipfs/QmfN86n98zwr9YzZN7RVHtJB75wGw7Ei51v3EjD77xg6af/'; // Replace with the actual image URL for ID 4
    default:
      return 'https://default-image.com'; // Replace with a default image URL
  }
}

  const refreshNFTMetadata = async (metadata) => {
    const url = 'https://api.sandbox.immutable.com/v1/chains/imtbl-zkevm-testnet/collections/0x9d2498974e6337292e0dc239502f6aa310954c1a/nfts/refresh-metadata';
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'x-immutable-api-key': 'sk_imapik-test-72Gew7UR7vxAGobF$alV_9cebcd'
      },
      body: JSON.stringify({
        nft_metadata: [metadata]
      })
    };
  
    try {
      const response = await fetch(url, options);
      const data = await response.json();
      console.log(data);
      alert("NFT Successfully evolved. LVL Checkpoint granted!")
    } catch (error) {
      console.error(error);
    }
  }


  const getNft = async function (callback) {
    if (window?.provider) {
      const chainName = 'imtbl-zkevm-testnet';
      const provider = new ethers.providers.Web3Provider(window.provider);
      const signer = provider.getSigner();
      const accountAddress = await signer.getAddress();
      console.log(accountAddress);
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
  
      try {
        const response = await client.listNFTsByAccountAddress({
          chainName,
          accountAddress,
          CONTRACT_ADDRESS,
        });
  
        const ownedNFTs = response.result || [];
  
        console.log(ownedNFTs);
        const namesToCompare = ['Level 1 Badge', 'Level 5 Badge - Alien Maestro', 'Level 8 Badge - Alien Commander', 'Level 10 Badge - Extraterrestrial Ace']; // Add the names you want to compare here
  
        let level = 0;

        ownedNFTs.forEach(nft => {
          if (namesToCompare.includes(nft.name)) {


            // Perform actions based on the matching name
            if (nft.name === 'Level 1 Badge') {
              level = Math.max(level, 2);

              let nftElement = document.getElementById("extras");
              nftElement.innerHTML += `
                <div class="alert alert-success"> 
                  Welcome Back Alien Tropper! You've been beeped back to Level 3.
                </div>`;

              console.log('Player owns NFT with Level 1 Badge');
            } else if (nft.name === 'Level 5 Badge - Alien Maestro') {
              level = Math.max(level, 4);
              player.upgradeSpaceship();

              let nftElement = document.getElementById("extras");
              nftElement.innerHTML += `
                <div class="alert alert-success"> 
                  Welcome Back Alien Maestro! You've been beeped back to Level 5.
                </div>`;

              console.log('Player owns NFT with Level 5 Badge');
            } if (nft.name === 'Level 8 Badge - Alien Commander') {
              level = Math.max(level, 7);

              let nftElement = document.getElementById("extras");
              nftElement.innerHTML += `
                <div class="alert alert-success"> 
                  Welcome Back Alien Commander! You've been beeped back to Level 8.
                </div>`;
                
              console.log('Player owns NFT with Level 8 Badge');
            } else if (nft.name === 'Level 10 Badge - Extraterrestrial Ace') {
              level = Math.max(level, 9);

              let nftElement = document.getElementById("extras");
              nftElement.innerHTML += `
                <div class="alert alert-success"> 
                  Welcome Back Extraterrestial Ace! You've been beeped back to Level 10.
                </div>`;
                
              console.log('Player owns NFT with Level 10 Badge');
            }
          }
        });

       invaders.rowsCount = level;
       console.log(level)
  
        if (response.result.length > 0) {
          window.nftDataReceived = true;
          callback(); // Invoke the callback function
        }
        else {
          window.nftDataReceived = true;
          callback(); // Invoke the callback function
        }
      } catch (error) {
        console.error(error);
      }
    } else {
      console.log("No provider found.");
    }
  };

  const displayMessage = (message) => {
    let nft = document.getElementById("extras");
    nft.innerHTML += `
      <div class="alert alert-success"> 
        ${message}
      </div>`;
  };

  function displayPowerupsUIAfterDelay() {
    setTimeout(() => {
      const event = new CustomEvent('showPowerupsUI');
      document.dispatchEvent(event);
    }, 2000);
  }
  
  const mintPowerup = async function () {
    if (window?.provider) {
        const provider = new ethers.providers.Web3Provider(window.provider);
        const signer = provider.getSigner();
        const userAddress = await signer.getAddress();
        const contract = new ethers.Contract(CONTRACT_ADDRESS2, CONTRACT_ABI, signer);
  
        try {
          
          const minterRole = await contract.MINTER_ROLE();
          const hasMinterRole = await contract.hasRole(minterRole, userAddress);
    
          if (!hasMinterRole) {
            console.log("Account doesnt have permissions to mint.");
            await grantPowerupMinterRole(userAddress);
          }
  
          const TOKEN_ID = getNextPowerupId(contract);
  
          const currentGasPrice = await provider.getGasPrice();
          const adjustedGasPrice = currentGasPrice.add(ethers.utils.parseUnits('10', 'gwei'));
  
          const tx = await contract.mint(userAddress, TOKEN_ID, {
            gasPrice: adjustedGasPrice, // for pre-EIP-1559
          });
            
            const receipt = await tx.wait();
            console.log('NFT minted successfully!', receipt);
            displayMessage(`NFT minted successfully!`, receipt);

      
            // Simulate a delay of 1 second before displaying the activate powerup screen
            setTimeout(() => {
              displayMessage('Powerup Successfully Bought!'); // Display activation message
              // Show activate powerup screen logic here...
              displayPowerupsUIAfterDelay();
            }, 1000);
            return true;
        } catch (error) {
           alert('Error minting Powerup NFT, Try Again:', error);
        }
    } else {
        console.log("No provider found.");
    }
  };

  async function getNextPowerupId(contract) {
    try {
      const totalSupply = await contract.totalSupply();
      console.log('totalSupply', totalSupply);
      return totalSupply.toNumber() +1;
    } catch (error) {
      console.error('Error getting next token ID:', error);
      return null;
    }
  }
  
  async function getNextTokenId(contract) {
    try {
      const totalSupply = await contract.totalSupply();
      return totalSupply.toNumber() +1;
    } catch (error) {
      console.error('Error getting next token ID:', error);
      return null;
    }
  }

  // Mint NFTs
const mintNft = async function () {
    if (window?.provider) {
        const provider = new ethers.providers.Web3Provider(window.provider);
        const signer = provider.getSigner();
        const userAddress = await signer.getAddress();
        const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
  
        try {
          
          const minterRole = await contract.MINTER_ROLE();
          const hasMinterRole = await contract.hasRole(minterRole, userAddress);
    
          if (!hasMinterRole) {
            console.log("Account doesnt have permissions to mint.");
            await grantMinterRole(userAddress);
          }
  
          const TOKEN_ID = getNextTokenId(contract);
  
          const currentGasPrice = await provider.getGasPrice();
          const adjustedGasPrice = currentGasPrice.add(ethers.utils.parseUnits('10', 'gwei'));
  
          const tx = await contract.mint(userAddress, TOKEN_ID, {
            gasPrice: adjustedGasPrice, // for pre-EIP-1559
          });
            
            const receipt = await tx.wait();
            console.log('NFT minted successfully!', receipt);
            let nft = document.getElementById("extras");
            nft.innerHTML += `
              <div class="alert alert-success"> 
                NFT minted successfully! Transaction hash: ${receipt.transactionHash}
              </div>`;
        } catch (error) {
            console.error('Error minting the first NFT:', error);
        }
    } else {
        console.log("No provider found.");
    }
  };
  

  const upgradeNft = async function () {
    const upgradeEvent = new CustomEvent('upgradeSpaceship');    
    window.dispatchEvent(upgradeEvent);
    nft.innerHTML += `
              <div class="alert alert-success"> 
                Your spaceship has been upgraded! At this stage, there is no NFT.
              </div>`;
  };

  window.addEventListener('load', function() {
    const passportBtn = this.document.getElementById('btn-passport');
    const logoutBtn = this.document.getElementById('btn-logout');
    
    passportBtn.onclick = function() {
      window.isconnecting = true;
      connectPassport(() => {
        // After connectPassport completes, call getNFT
        getNft(() => {
          //console.log(invaders.rowsCount);
          console.log('NFT data received!'); // Placeholder action upon successful retrieval
        });
      });
    };

    logoutBtn.onclick = passportLogout;
    window.passport.loginCallback();
});