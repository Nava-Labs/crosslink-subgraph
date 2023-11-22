import { BigInt, Address, Bytes } from '@graphprotocol/graph-ts'
import {
  Listing as ListedEvent,
  Sale as SaleEvent
} from "../generated/NFT/CrosslinkMarketplace"
import { ListedNFT, Activity } from "../generated/schema"
import { ERC721 } from "../generated/NFT/ERC721"
import { ZERO_BI } from './helpers'

export function handleListed(listedEvent: ListedEvent): void {
  let nftId = listedEvent.params.tokenAddress.toHex() + '-' + listedEvent.params.tokenId.toString();
  let nft = ListedNFT.load(nftId);
  if (nft == null){
    nft = new ListedNFT(nftId);
  }
  nft.collectionAddress = listedEvent.params.tokenAddress;
  nft.owner = listedEvent.params.ownerAddress;
  nft.collectionName = listedEvent.params.collectionName;
  nft.uri = listedEvent.params.tokenURI;
  nft.price = listedEvent.params.price;
  nft.chainOrigin = listedEvent.params.chainIdSelector;

  //add listing 
  let saleId = listedEvent.address.toHex() + '-' + listedEvent.params.tokenId.toString() + '-' + listedEvent.block.timestamp.toString();

  let activity = Activity.load(saleId);
  if (activity == null) {
    activity = new Activity(saleId);
  }
  activity.type = "List";
  activity.from = listedEvent.params.ownerAddress;
  activity.to = Bytes.fromHexString("0x0000000000000000000000000000000000000000");
  activity.timestamp = listedEvent.block.timestamp;
  activity.price = listedEvent.params.price;
  activity.listedNFT = nftId;
  
  activity.save();
  nft.save()
}

export function handleSale(saleEvent: SaleEvent): void{
  let saleId = saleEvent.address.toHex() + '-' + saleEvent.params.tokenId.toString() + '-' + saleEvent.block.timestamp.toString();
  let tokenId = saleEvent.params.tokenAddress.toHex() + '-' + saleEvent.params.tokenId.toString();
  let activity = Activity.load(saleId);
  if (activity == null) {
    activity = new Activity(saleId);
  }
  let type = "";
  switch(saleEvent.params.saleType){ //saleType is enum so needs to add conditional
    case 0:
      type = "Sale Native"
      break;
    case 1:
      type = "Sale Cross Chain"
      break;
  }
  activity.type = type;
  activity.from = saleEvent.params.prevOwner;
  activity.to = saleEvent.params.newOwner;
  activity.timestamp = saleEvent.block.timestamp;
  activity.nftOrigin = saleEvent.params.originChainIdSelector;
  activity.saleOrigin = saleEvent.params.saleChainIdSelector;

  let nft = ListedNFT.load(tokenId);
  if (nft==null){ //shouldnt be possible but just in case.
    nft = new ListedNFT(tokenId);
  }

  nft.collectionName = saleEvent.params.collectionName;
  nft.uri = saleEvent.params.tokenURI;
  nft.owner = saleEvent.params.newOwner;
  nft.collectionAddress = saleEvent.params.tokenAddress;
  activity.price = nft.price; //preserve the price
  nft.price = ZERO_BI; //delist
  activity.listedNFT = tokenId;
  nft.save();
  activity.save();
}
