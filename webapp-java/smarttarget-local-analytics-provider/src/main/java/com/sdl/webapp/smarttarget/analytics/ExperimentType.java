package com.sdl.webapp.smarttarget.analytics;

/**
 * ExperimentType
 *
 * @author nic
 */
public enum ExperimentType {

    VIEW(0),
    CONVERSION(1);

    private int id;

    private ExperimentType(int id) {
       this.id = id;
    }
    public int toInt() {
        return this.id;
    }

    public static ExperimentType fromInt(int intValue) {
        for ( ExperimentType type : ExperimentType.values() ) {
            if ( type.id == intValue ) {
                return type;
            }
        }
        return null;
    }
}