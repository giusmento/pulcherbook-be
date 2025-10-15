import { INVERSITY_TYPES as INVERSITY_TYPES_DEFAULT } from '@mangojs/core'

export const INVERSITY_TYPES = {
    ...INVERSITY_TYPES_DEFAULT,
    ...{
        AdminUserService: Symbol.for('AdminUserService'),
    },
}
