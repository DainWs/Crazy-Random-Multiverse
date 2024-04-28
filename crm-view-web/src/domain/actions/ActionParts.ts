import ActionTarget from "@/domain/actions/ActionSource";
import ActionSource from "@/domain/actions/ActionTarget";

type ActionParts = {
    source: ActionSource,
    target: ActionTarget
}

export default ActionParts;