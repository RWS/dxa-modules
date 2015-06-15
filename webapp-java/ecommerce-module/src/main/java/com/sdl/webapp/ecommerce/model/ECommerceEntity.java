package com.sdl.webapp.ecommerce.model;

import com.sdl.webapp.common.api.model.ViewModel;

/**
 * EcommerceEntity
 *
 * @author nic
 */
public interface ECommerceEntity extends ViewModel {

    String getId();

    String getName();

    String getModuleName();
}