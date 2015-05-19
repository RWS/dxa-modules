package com.sdl.webapp.ecommerce.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.sdl.webapp.common.api.model.MvcData;
import com.sdl.webapp.common.api.model.ViewModel;

/**
 * AbstractEcommerceModel
 *
 * @author nic
 */
public abstract class AbstractEcommerceModel implements ViewModel {

    @JsonIgnore
    private MvcData mvcData;

    @Override
    public MvcData getMvcData() {
        return mvcData;
    }

    public void setMvcData(MvcData mvcData) {
        this.mvcData = mvcData;
    }

}
