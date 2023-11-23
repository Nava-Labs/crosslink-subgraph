import { BigInt, Address, Bytes, ethereum, log } from '@graphprotocol/graph-ts'
import { Listing as ListingEvent, Sale as SaleEvent } from "../generated/NFT/CrosslinkMarketplace"
import { ListedNFT, Activity } from "../generated/schema"
import { LISTING_MESSAGE_ID, ZERO_BI } from './helpers'

export function handleListed(listedEvent: ListingEvent): void {
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

  nft.save()
  
  let saleId = listedEvent.address.toHex() + '-' + listedEvent.params.tokenId.toString() + '-' + listedEvent.block.timestamp.toString();

  let activity = Activity.load(saleId);
  if (activity == null) {
    activity = new Activity(saleId);
  }
  activity.type = "List";
  activity.from = listedEvent.params.ownerAddress;
  activity.activityOrigin = listedEvent.params.chainIdSelector;
  activity.to = Bytes.fromHexString("0x0000000000000000000000000000000000000000");
  activity.timestamp = listedEvent.block.timestamp;
  activity.price = listedEvent.params.price;
  activity.listedNFT = nftId;
  
  activity.save();
  
}

export function handleSale(saleEvent: SaleEvent): void {
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
  activity.activityOrigin = saleEvent.params.saleChainIdSelector;
  activity.to = saleEvent.params.newOwner;
  activity.timestamp = saleEvent.block.timestamp;

  let nft = ListedNFT.load(tokenId);
  if (nft==null){ //shouldnt be possible but just in case.
    nft = new ListedNFT(tokenId);
  }

  nft.owner = saleEvent.params.newOwner;
  nft.collectionAddress = saleEvent.params.tokenAddress;
  activity.price = nft.price; //preserve the price
  nft.price = ZERO_BI; //delist
  activity.listedNFT = tokenId;

  nft.save();
  activity.save();
}
