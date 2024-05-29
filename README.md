# Zawda Platform

# Core Bitcoin Application
This repository contains the code for running the core Bitcoin application.

## Table of Contents
* [Dependencies](#dependencies)
* [Installation & Usage](#installation--usage)
* [License](#license)
* [Contributors](#contributors)

## Dependencies

The following dependencies are required to run the application:
* mysql : Node.js driver for MySQL databases
* winston : Logging library for Node.js
* BitcoinJS : JavaScript Bitcoin library for Node.js and browsers
* tiny-secp256k1 : BitcoinJS API
* bip32 : Bitcoin Improvement Proposal 32, a hierarchical deterministic wallet format
* bs58check : Base58Check encoding for Bitcoin addresses
* axios : HTTP client for the browser and Node.js
* dotenv

## Installation & Usage

1. Install npm:
```
sudo apt-get update
sudo apt-get install npm
```

2. Install the required dependencies:
```
sudo npm install mysql
sudo npm install winston
sudo npm install dotenv
sudo npm install bitcoinjs-lib
sudo npm install tiny-secp256k1
sudo npm install bip32
sudo npm install bs58check
sudo npm install axios
```

3. Clone the repository:  
`git clone https://github.com/javierzawda/core.git`

4. Run the application:
```
cd core/

node app.js
```

  4.1 Test multisig addresses.

This is procedure to test multisig component using [unchained-bitcoin](https://github.com/unchained-capital/unchained-bitcoin) library,  used in Caravan.   Caravan is tool used by Zawda Platform to handle vaults.

In first machine we create a new address and get its private key.

```
javier@nlp:~$ bitcoin-cli getaddressinfo tb1qppxqep8cq3fegy32jamzawfpq043vmpx5wnygn{
  "address": "tb1qppxqep8cq3fegy32jamzawfpq043vmpx5wnygn",
  "scriptPubKey": "0014084c0c84f8045394122a97762eb92103eb166c26",
  "ismine": true,
  "solvable": true,
  "desc": "wpkh([3a6308e6/0'/0'/25']0239c50fb6e1f9ce31af822921bfd64317d3c74727fc38830346c3afd86321a7df)#sxfltfd0",
  "iswatchonly": false,
  "isscript": false,
  "iswitness": true,
  "witness_version": 0,
  "witness_program": "084c0c84f8045394122a97762eb92103eb166c26",
  "pubkey": "0239c50fb6e1f9ce31af822921bfd64317d3c74727fc38830346c3afd86321a7df",
  "ischange": false,
  "timestamp": 1587251414,
  "hdkeypath": "m/0'/0'/25'",
  "hdseedid": "78aa3ebf68c4d00594a76fd234d5db2e7d20ca22",
  "hdmasterfingerprint": "3a6308e6",
  "labels": [
    ""
  ]
}
javier@nlp:~$ bitcoin-cli dumpprivkey tb1qppxqep8cq3fegy32jamzawfpq043vmpx5wnygn
cUodCQzrUWe3jUtSB4WHvv6z4NokfGz2zn5SRS4p48gc7vqoY3BT

```
In second machine we create a new address and get its private key.

```
javier@bitcoin:~$ bitcoin-cli getaddressinfo tb1qnguzmvcu6chc5uwjm0h89sntcg4x9g94pequr7
{
  "address": "tb1qnguzmvcu6chc5uwjm0h89sntcg4x9g94pequr7",
  "scriptPubKey": "00149a382db31cd62f8a71d2dbee72c26bc22a62a0b5",
  "ismine": true,
  "solvable": true,
  "desc": "wpkh([75dfbf6a/0'/0'/0']02919bfe3980d01a05459731a17c8c8c3f844c58b53f0a33ad20d6d81b6ab41849)#9pnhmyvz",
  "iswatchonly": false,
  "isscript": false,
  "iswitness": true,
  "witness_version": 0,
  "witness_program": "9a382db31cd62f8a71d2dbee72c26bc22a62a0b5",
  "pubkey": "02919bfe3980d01a05459731a17c8c8c3f844c58b53f0a33ad20d6d81b6ab41849",
  "ischange": false,
  "timestamp": 1707645924,
  "hdkeypath": "m/0'/0'/0'",
  "hdseedid": "db7fd4ba57e018cbe6dc5948b356e3429151714c",
  "hdmasterfingerprint": "75dfbf6a",
  "labels": [
    ""
  ]
}
javier@bitcoin:~$ bitcoin-cli dumpprivkey tb1qnguzmvcu6chc5uwjm0h89sntcg4x9g94pequr7
cMhxbwZyjWUcfA2f6gCfD6zDL4H1n5m5LGJeQmsqor2LoU8QH3sS
```
Now we add a third key and create a new address using command createmultisig

```
javier@bitcoin:~$ bitcoin-cli createmultisig 2 "[\"0239c50fb6e1f9ce31af822921bfd64317d3c74727fc38830346c3afd86321a7df\",\"02919bfe3980d01a05459731a17c8c8c3f844c58b53f0a33ad20d6d81b6ab41849\",\"02baf8deb4762cd03296cbc958edaa708d33fa50054241b62d49806e5ee8ff50ec\"]"
{
  "address": "2MyRUizdoLyNKBtc7hCh9rHv5wG1zZrt2wu",
  "redeemScript": "52210239c50fb6e1f9ce31af822921bfd64317d3c74727fc38830346c3afd86321a7df2102919bfe3980d01a05459731a17c8c8c3f844c58b53f0a33ad20d6d81b6ab418492102baf8deb4762cd03296cbc958edaa708d33fa50054241b62d49806e5ee8ff50ec53ae",
  "descriptor": "sh(multi(2,0239c50fb6e1f9ce31af822921bfd64317d3c74727fc38830346c3afd86321a7df,02919bfe3980d01a05459731a17c8c8c3f844c58b53f0a33ad20d6d81b6ab41849,02baf8deb4762cd03296cbc958edaa708d33fa50054241b62d49806e5ee8ff50ec))#xvj7ay47"
}
```
We sent some funds to this address 2MyRUizdoLyNKBtc7hCh9rHv5wG1zZrt2wu in this [transaction](https://mempool.space/testnet/tx/b76e4cfe5253568dcf68470598b5e270f3e4827119350a0858e0370e4b255238).   As bitcoin core does not support multisig address natively we need to import address like this:

```

javier@bitcoin:~$ bitcoin-cli  importmulti '[{"desc": "sh(multi(2,0239c50fb6e1f9ce31af822921bfd64317d3c74727fc38830346c3afd86321a7df,02919bfe3980d01a05459731a17c8c8c3f844c58b53f0a33ad20d6d81b6ab41849,02baf8deb4762cd03296cbc958edaa708d33fa50054241b62d49806e5ee8ff50ec))#xvj7ay47", "timestamp": "now", "watchonly": true}]'
  
[
  {
    "success": true
  }
]
```
Use `listunspent` command to check if it was imported;  notice that it's marked as "spendable": false.   

```
javier@bitcoin:~$ bitcoin-cli listunspent
[
  {
    "txid": "b76e4cfe5253568dcf68470598b5e270f3e4827119350a0858e0370e4b255238",
    "vout": 0,
    "address": "2MyRUizdoLyNKBtc7hCh9rHv5wG1zZrt2wu",
    "label": "",
    "redeemScript": "52210239c50fb6e1f9ce31af822921bfd64317d3c74727fc38830346c3afd86321a7df2102919bfe3980d01a05459731a17c8c8c3f844c58b53f0a33ad20d6d81b6ab418492102baf8deb4762cd03296cbc958edaa708d33fa50054241b62d49806e5ee8ff50ec53ae",
    "scriptPubKey": "a91443c137341779e1ce6a296974e14a1cc74949355987",
    "amount": 0.00072663,
    "confirmations": 13,
    "spendable": false,
    "solvable": true,
    "desc": "sh(multi(2,[084c0c84]0239c50fb6e1f9ce31af822921bfd64317d3c74727fc38830346c3afd86321a7df,[9a382db3]02919bfe3980d01a05459731a17c8c8c3f844c58b53f0a33ad20d6d81b6ab41849,[f238e4cd]02baf8deb4762cd03296cbc958edaa708d33fa50054241b62d49806e5ee8ff50ec))#5dlfsm74",
    "parent_descs": [
    ],
    "safe": true
  }
]
```
It's time to sign spending transaction with first key.     We need to create a new unsigned transaction and obtain hex data.

```
javier@bitcoin:~$ utxo_txid=b76e4cfe5253568dcf68470598b5e270f3e4827119350a0858e0370e4b255238
javier@bitcoin:~$ utxo_vout=0
javier@bitcoin:~$ utxo_spk=a91443c137341779e1ce6a296974e14a1cc74949355987
javier@bitcoin:~$ redeem_script=52210239c50fb6e1f9ce31af822921bfd64317d3c74727fc38830346c3afd86321a7df2102919bfe3980d01a05459731a17c8c8c3f844c58b53f0a33ad20d6d81b6ab418492102baf8deb4762cd03296cbc958edaa708d33fa50054241b62d49806e5ee8ff50ec53ae
javier@bitcoin:~$ recipient=tb1qsa0dw9csvptvep502r8skgkurshqj0eggfnvlv
javier@bitcoin:~$ rawtxhex=$(bitcoin-cli -named createrawtransaction inputs='''[ { "txid": "'$utxo_txid'", "vout": '$utxo_vout' } ]''' outputs='''{ "'$recipient'": 0.00001}''')
javier@bitcoin:~$ echo $rawtxhex
02000000013852254b0e37e058080a35197182e4f370e2b598054768cf8d565352fe4c6eb70000000000fdffffff01e803000000000000160014875ed717106056cc868f50cf0b22dc1c2e093f2800000000
javier@bitcoin:~$ 
```
Now using a private key with use command `signrawtransactionwithkey` that allows sign a transaction:
```
javier@bitcoin:~$ bitcoin-cli -named signrawtransactionwithkey hexstring=$rawtxhex prevtxs='''[ { "txid": "'$utxo_txid'", "vout": '$utxo_vout', "scriptPubKey": "'$utxo_spk'", "redeemScript": "'$redeem_script'" } ]''' privkeys='["cMhxbwZyjWUcfA2f6gCfD6zDL4H1n5m5LGJeQmsqor2LoU8QH3sS"]'
{
  "hex": "02000000013852254b0e37e058080a35197182e4f370e2b598054768cf8d565352fe4c6eb700000000b50047304402201a22e78c567f64c6b1a8f1e277e3a28a6fabf64bbdeb7b16b342d950e79043cd022050f10281ed50d7decf2a3419ad3afdbf7b344843ed457de1f2292f8cbe18cc3b01004c6952210239c50fb6e1f9ce31af822921bfd64317d3c74727fc38830346c3afd86321a7df2102919bfe3980d01a05459731a17c8c8c3f844c58b53f0a33ad20d6d81b6ab418492102baf8deb4762cd03296cbc958edaa708d33fa50054241b62d49806e5ee8ff50ec53aefdffffff01e803000000000000160014875ed717106056cc868f50cf0b22dc1c2e093f2800000000",
  "complete": false,
  "errors": [
    {
      "txid": "b76e4cfe5253568dcf68470598b5e270f3e4827119350a0858e0370e4b255238",
      "vout": 0,
      "witness": [
      ],
      "scriptSig": "0047304402201a22e78c567f64c6b1a8f1e277e3a28a6fabf64bbdeb7b16b342d950e79043cd022050f10281ed50d7decf2a3419ad3afdbf7b344843ed457de1f2292f8cbe18cc3b01004c6952210239c50fb6e1f9ce31af822921bfd64317d3c74727fc38830346c3afd86321a7df2102919bfe3980d01a05459731a17c8c8c3f844c58b53f0a33ad20d6d81b6ab418492102baf8deb4762cd03296cbc958edaa708d33fa50054241b62d49806e5ee8ff50ec53ae",
      "sequence": 4294967293,
      "error": "CHECK(MULTI)SIG failing with non-zero signature (possibly need more signatures)"
    }
  ]
}
```
Because it's a 2-3 multisig address,  it returns a "complete": false and put an error << "error": "CHECK(MULTI)SIG failing with non-zero signature (possibly need more signatures)" >>.   It means we need to add another sign, to complete quorum 2 of 3 signatures.  We use last HEX value (including first signature) and launch again `signrawtransactionwithkey` with other key.   

```
javier@bitcoin:~$ bitcoin-cli -named signrawtransactionwithkey hexstring=02000000013852254b0e37e058080a35197182e4f370e2b598054768cf8d565352fe4c6eb700000000b50047304402201a22e78c567f64c6b1a8f1e277e3a28a6fabf64bbdeb7b16b342d950e79043cd022050f10281ed50d7decf2a3419ad3afdbf7b344843ed457de1f2292f8cbe18cc3b01004c6952210239c50fb6e1f9ce31af822921bfd64317d3c74727fc38830346c3afd86321a7df2102919bfe3980d01a05459731a17c8c8c3f844c58b53f0a33ad20d6d81b6ab418492102baf8deb4762cd03296cbc958edaa708d33fa50054241b62d49806e5ee8ff50ec53aefdffffff01e803000000000000160014875ed717106056cc868f50cf0b22dc1c2e093f2800000000 prevtxs='''[ { "txid": "'$utxo_txid'", "vout": '$utxo_vout', "scriptPubKey": "'$utxo_spk'", "redeemScript": "'$redeem_script'" } ]''' privkeys='["cUodCQzrUWe3jUtSB4WHvv6z4NokfGz2zn5SRS4p48gc7vqoY3BT"]'
{
  "hex": "02000000013852254b0e37e058080a35197182e4f370e2b598054768cf8d565352fe4c6eb700000000fc004730440220440ffc36eb0a91dccd6d6019566a92b817f23024a55cd2260b4afda605d0ff5b02203a1364badb08dce31d14a6a014876f7a719980aa391329b0e6d387099cd70c9f0147304402201a22e78c567f64c6b1a8f1e277e3a28a6fabf64bbdeb7b16b342d950e79043cd022050f10281ed50d7decf2a3419ad3afdbf7b344843ed457de1f2292f8cbe18cc3b014c6952210239c50fb6e1f9ce31af822921bfd64317d3c74727fc38830346c3afd86321a7df2102919bfe3980d01a05459731a17c8c8c3f844c58b53f0a33ad20d6d81b6ab418492102baf8deb4762cd03296cbc958edaa708d33fa50054241b62d49806e5ee8ff50ec53aefdffffff01e803000000000000160014875ed717106056cc868f50cf0b22dc1c2e093f2800000000",
  "complete": true
}
```
Now we get a successfull message "complete": true.

## Testing Zawda Platform.

Using programm called unchained.js replace all 3 public keys and 2 signatures.    Program will create redeem_script and spent using provided signatures.

```
javier@bitcoin:~$ node unchained.js 
{
  messagePrefix: '\x18Bitcoin Signed Message:\n',
  bech32: 'tb',
  bip32: { public: 70617039, private: 70615956 },
  pubKeyHash: 111,
  scriptHash: 196,
  wif: 239
}
Network :  {
  MAINNET: 'mainnet',
  TESTNET: 'testnet',
  REGTEST: 'regtest',
  SIGNET: 'signet'
}
Claves publicas sin orden: [
  '0239c50fb6e1f9ce31af822921bfd64317d3c74727fc38830346c3afd86321a7df',
  '02919bfe3980d01a05459731a17c8c8c3f844c58b53f0a33ad20d6d81b6ab41849',
  '02baf8deb4762cd03296cbc958edaa708d33fa50054241b62d49806e5ee8ff50ec'
]
Claves públicas ordenadas: [
  '0239c50fb6e1f9ce31af822921bfd64317d3c74727fc38830346c3afd86321a7df',
  '02919bfe3980d01a05459731a17c8c8c3f844c58b53f0a33ad20d6d81b6ab41849',
  '02baf8deb4762cd03296cbc958edaa708d33fa50054241b62d49806e5ee8ff50ec'
]
networkData: {"messagePrefix":"\u0018Bitcoin Signed Message:\n","bech32":"tb","bip32":{"public":70617039,"private":70615956},"pubKeyHash":111,"scriptHash":196,"wif":239}
2MyRUizdoLyNKBtc7hCh9rHv5wG1zZrt2wu
```
Now that we have received some coins on address,  we are going to spent from this address using Zawda Software.

This image shows that the last recorded transaction spends funds from a multi-signature address 2 of 3, on the day  22-02.

<img width="1219" alt="Screenshot 2024-02-22 at 22 00 39" src="https://github.com/javierzawda/zawda/blob/main/307149839-8edf57dc-360e-4406-8af1-cf11946ae408.png">

We use Zawda software for that, implemented on psbt.js program.

```
bitcoin:~$ node psbt.js
=>: [
  {
    txid: 'a7caf82bc502d33bbcd256e60b450e9f9a61faf9b9858315e5c8eda9b4ff0452',
    vout: 0,
    scriptPubKey: 'a91443c137341779e1ce6a296974e14a1cc74949355987',
    amount: 87943
  },
  {
    txid: 'a7caf82bc502d33bbcd256e60b450e9f9a61faf9b9858315e5c8eda9b4ff0452',
    vout: 1,
    scriptPubKey: 'a9141b9cc7b3df1d3cb04c05b9720330396d54e58a3587',
    amount: 716595227
  }
]
{
  hash: 'b76e4cfe5253568dcf68470598b5e270f3e4827119350a0858e0370e4b255238',
  index: 0,
  nonWitnessUtxo: <Buffer 02 00 00 00 00 01 01 6a 6a 82 59 5d 1a 28 b4 57 95 7f c4 3a a0 46 f6 4c 59 95 24 ed 41 73 26 61 5a 69 9a 02 c3 fc ce 00 00 00 00 00 fd ff ff ff 02 d7 ... 174 more bytes>,
  redeemScript: <Buffer 52 21 02 39 c5 0f b6 e1 f9 ce 31 af 82 29 21 bf d6 43 17 d3 c7 47 27 fc 38 83 03 46 c3 af d8 63 21 a7 df 21 02 91 9b fe 39 80 d0 1a 05 45 97 31 a1 7c ... 55 more bytes>
}
Psbt {
  data: Psbt {
    inputs: [ [Object] ],
    outputs: [ [Object] ],
    globalMap: { unsignedTx: PsbtTransaction {} }
  }
}
Raw Hex 02000000013852254b0e37e058080a35197182e4f370e2b598054768cf8d565352fe4c6eb700000000fdfd000047304402202c39e76a18ab0c7b7ecc2bb0830172ddcd266b1a341404a1242672bb00533c8502201311feab57e542c812b0a75de950fae83f360a78f5d6efeeedef3d086795e73a01483045022100b51aa91ea98b025d11360620e5278e33eb50dafd1a1a0db8e3d21cea3353a17f02205cba812db433daf9ea3e55f5891dce0f10d637f732cd83978ecf650578b19acb014c6952210239c50fb6e1f9ce31af822921bfd64317d3c74727fc38830346c3afd86321a7df2102919bfe3980d01a05459731a17c8c8c3f844c58b53f0a33ad20d6d81b6ab418492102baf8deb4762cd03296cbc958edaa708d33fa50054241b62d49806e5ee8ff50ec53aeffffffff011027000000000000160014875ed717106056cc868f50cf0b22dc1c2e093f2800000000
javier@nlp /var/www/unchain$ 

```

## License

This software is licensed under the GNU General Public License v3.0. See the [LICENSE](LICENSE) file for the full license text.

## Contributors
* Javier Vargas
* Oday Kamal
