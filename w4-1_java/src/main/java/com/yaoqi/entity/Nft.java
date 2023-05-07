package com.yaoqi.entity;

import com.baomidou.mybatisplus.annotation.TableField;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.io.Serializable;

/**
 * <p>
 * 
 * </p>
 *
 * @author yaoqi
 * @since 2023-03-31
 */
@Data
@EqualsAndHashCode(callSuper = false)
public class Nft implements Serializable {

    private static final long serialVersionUID=1L;

    @TableField("tokenId")
    private String tokenId;

    @TableField("masterAddr")
    private String masterAddr;


}
