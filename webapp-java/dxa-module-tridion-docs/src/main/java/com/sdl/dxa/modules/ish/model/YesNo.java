package com.sdl.dxa.modules.ish.model;

import javax.xml.bind.annotation.XmlEnum;
import javax.xml.bind.annotation.XmlType;
import javax.xml.bind.annotation.XmlEnumValue;
@XmlType(
        name = "yesNo"
)
@XmlEnum
public enum YesNo {
    @XmlEnumValue("yes")
    YES("yes"),
    @XmlEnumValue("no")
    NO("no");

    private final String value;

    private YesNo(String v) {
        this.value = v;
    }

    public String value() {
        return this.value;
    }

    public static YesNo fromValue(String v) {
        YesNo[] var1 = values();
        int var2 = var1.length;

        for(int var3 = 0; var3 < var2; ++var3) {
            YesNo c = var1[var3];
            if (c.value.equals(v)) {
                return c;
            }
        }

        throw new IllegalArgumentException(v);
    }
}

