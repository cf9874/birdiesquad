import { FanSubIndex, ProSubIndex, TabIndex } from "const/rank.const"

export const RankUtil = {
    findEventName: ({ tabIndex, subIndex }: { tabIndex: TabIndex; subIndex: FanSubIndex | ProSubIndex }) => {
        const result = {
            indexName: "",
            indexNumber: "",
        }
        if (tabIndex === TabIndex.FAN) {
            console.log("fan")
            //팬
            result.indexNumber = "150"
            switch (subIndex) {
                case FanSubIndex.MOSTFAN:
                    result.indexName = "most"
                    break
                case FanSubIndex.DONATEAMOUNT:
                    result.indexName = "support"
                    break
                case FanSubIndex.DONATECOUNT:
                    result.indexName = "supportCount"
                    break
                case FanSubIndex.HEARTAMOUT:
                    result.indexName = "heart"
                    break
                case FanSubIndex.PROFILEUP:
                    result.indexName = "profile"
                    break
            }
        } else {
            console.log("pro")
            //프로
            result.indexNumber = "155"
            switch (subIndex) {
                case ProSubIndex.EARNAMOUNT:
                    result.indexName = "earning"
                    break
                case ProSubIndex.DONATECOUNT:
                    result.indexName = "supportCount"
                    break
                case ProSubIndex.HEARTAMOUT:
                    result.indexName = "heart"
                    break
                case ProSubIndex.PROFILEUP:
                    result.indexName = "profile"
                    break
            }
        }
        return result
    },
}
