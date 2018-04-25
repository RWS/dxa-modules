package com.sdl.dxa.modules.ugc.model.entity;

import com.sdl.dxa.caching.NeverCached;
import com.sdl.webapp.common.api.model.MvcData;
import com.sdl.webapp.common.api.model.RegionModel;
import com.sdl.webapp.common.api.model.region.RegionModelImpl;
import com.sdl.webapp.common.exceptions.DxaException;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 *
 */
@EqualsAndHashCode(callSuper = true)
@Data
public class UgcRegion  extends RegionModelImpl {
    /**
     * @param other other Region
     */
    public UgcRegion(RegionModel other) {
        super(other);
    }

    /**
     * @param name Region name
     * @throws DxaException
     */
    public UgcRegion(String name) throws DxaException {
        super(name);
    }

    /**
     * @param name region name
     * @param qualifiedViewName view name
     * @throws DxaException
     */
    public UgcRegion(String name, String qualifiedViewName) throws DxaException {
        super(name, qualifiedViewName);
    }

    /**
     * @param mvcData
     * @throws DxaException
     */
    public UgcRegion(MvcData mvcData) throws DxaException {
        super(mvcData);
    }
}
