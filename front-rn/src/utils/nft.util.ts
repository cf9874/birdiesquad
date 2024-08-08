import { Grade, GradeName } from "const"

export const NftUtil = {
    findGrade: (grade: Grade | undefined) => {
        if (!grade) return ""

        switch (grade) {
            case Grade.COMMON:
                return GradeName.COMMON
            case Grade.UNCOMMON:
                return GradeName.UNCOMMON
            case Grade.RARE:
                return GradeName.RARE
            case Grade.SUPERRARE:
                return GradeName.SUPERRARE
            case Grade.EPIC:
                return GradeName.EPIC
            case Grade.LEGENDARY:
                return GradeName.LEGENDARY
        }
    },
}
