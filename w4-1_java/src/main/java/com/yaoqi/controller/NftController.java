package com.yaoqi.controller;


import com.yaoqi.entity.Nft;
import com.yaoqi.service.NftService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

/**
 * <p>
 *  前端控制器
 * </p>
 *
 * @author yaoqi
 * @since 2023-03-31
 */
@RestController
@RequestMapping("/nft")
public class NftController {
    @Autowired
    private NftService nftService;

    @RequestMapping("/saveNFT")
    public Boolean saveProduct(String[] data) {
        Nft nft = new Nft();
        String tokenId=data[3];
        String addr=data[2];
        nft.setTokenId(tokenId);
        nft.setMasterAddr(addr);
        nftService.save(nft);
        return true;
    }
}

