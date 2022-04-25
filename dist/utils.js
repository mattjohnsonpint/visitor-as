import { DeclarationStatement, Source, SourceKind, ClassDeclaration, TypeNode, NodeKind, InterfaceDeclaration, FunctionDeclaration, TypeName, DiagnosticCategory, NamedTypeNode, util, } from "assemblyscript/dist/assemblyscript.js";
import { ASTBuilder } from "./astBuilder.js";
import cloneDeep from "lodash.clonedeep";
// const cloneDeep: <T>(t: T) => T = require("lodash.clonedeep") as any;
export function decorates(node, name) {
    return node.name.text === name;
}
export function isDecorator(name) {
    return (node) => decorates(node, name);
}
export function hasDecorator(node, name) {
    let decl;
    if (node instanceof DeclarationStatement) {
        decl = node;
    }
    else {
        decl = node.declaration;
    }
    // because it could be undefined
    return decl.decorators?.some(isDecorator(name)) == true;
}
export function getDecorator(node, name) {
    return node.decorators?.find(isDecorator(name));
}
export function isLibrary(node) {
    return node.isLibrary || node.internalPath.startsWith("~lib/rt/");
}
export function not(fn) {
    return (t) => !fn(t);
}
export function toString(node) {
    return ASTBuilder.build(node);
}
const OR_NULL = /\|.*null/;
export function getName(node) {
    if (node instanceof TypeNode) {
        if (node instanceof NamedTypeNode) {
            let name = getTypeName(node.name);
            const typeParameters = node.typeArguments;
            if (typeParameters && typeParameters.length > 0) {
                name += `<${typeParameters.map(getName).join(", ")}>`;
            }
            if (node.isNullable && !OR_NULL.test(name)) {
                name = `${name} | null`;
            }
            return name;
        }
        else if (node instanceof TypeName) {
            return toString(node.identifier);
        }
        return "";
    }
    if (node instanceof ClassDeclaration || node instanceof InterfaceDeclaration || node instanceof FunctionDeclaration) {
        return className(node);
    }
    return toString(node.name);
}
export function getTypeName(node) {
    let name = toString(node.identifier);
    if (node.next) {
        name += getTypeName(node.next);
    }
    return name;
}
export function cloneNode(node) {
    return cloneDeep(node);
}
export function isUserEntry(node) {
    return node.range.source.sourceKind == SourceKind.USER_ENTRY;
}
export function isEntry(node) {
    return isUserEntry(node) || node.range.source.sourceKind == SourceKind.LIBRARY_ENTRY;
}
export function className(_class) {
    let name = toString(_class.name);
    const typeParameters = _class.typeParameters;
    if (typeParameters) {
        name += `<${typeParameters.map(getName).join(", ")}>`;
    }
    return name;
}
export function isMethodNamed(name) {
    return (stmt) => stmt.kind == NodeKind.METHODDECLARATION && toString(stmt.name) === name;
}
export function updateSource(program, newSource) {
    const sources = program.sources;
    for (let i = 0, len = sources.length; i < len; i++) {
        if (sources[i].internalPath == newSource.internalPath) {
            sources[i] = newSource;
            break;
        }
    }
}
export class StringBuilder {
    sb = [];
    push(s) {
        this.sb.push(s);
    }
    finish(separator = "\n") {
        let res = this.sb.join(separator);
        this.sb = [];
        return res;
    }
    get last() { return this.sb[this.sb.length - 1]; }
}
/**
 *
 * @param emitter DiagnosticEmitter
 * @returns return true if emitter have ERROR message
 */
export function hasErrorMessage(emitter) {
    return hasMessage(emitter, DiagnosticCategory.ERROR);
}
/**
*
* @param emitter DiagnosticEmitter
* @returns return true if emitter have WARNING message
*/
export function hasWarningMessage(emitter) {
    return hasMessage(emitter, DiagnosticCategory.WARNING);
}
/**
*
* @param emitter DiagnosticEmitter
* @returns return true if emitter have `category` message
*/
export function hasMessage(emitter, category) {
    const diagnostics = emitter.diagnostics ? emitter.diagnostics : [];
    for (const msg of diagnostics) {
        if (msg.category === category) {
            return true;
        }
    }
    return false;
}
let isStdlibRegex = /\~lib\/(?:array|arraybuffer|atomics|builtins|crypto|console|compat|dataview|date|diagnostics|error|function|iterator|map|math|number|object|process|reference|regexp|set|staticarray|string|symbol|table|typedarray|vector|rt\/?|bindings\/|shared\/typeinfo)|util\/|uri|polyfills|memory/;
export function isStdlib(s) {
    let source = s instanceof Source ? s : s.range.source;
    return isStdlibRegex.test(source.internalPath);
}
export const indent = util.indent;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvdXRpbHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUdMLG9CQUFvQixFQUNwQixNQUFNLEVBRU4sVUFBVSxFQUVWLGdCQUFnQixFQUNoQixRQUFRLEVBQ1IsUUFBUSxFQUNSLG9CQUFvQixFQUNwQixtQkFBbUIsRUFDbkIsUUFBUSxFQUNSLGtCQUFrQixFQUVsQixhQUFhLEVBRWIsSUFBSSxHQUNMLE1BQU0sdUNBQXVDLENBQUM7QUFDL0MsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQzdDLE9BQU8sU0FBUyxNQUFNLGtCQUFrQixDQUFDO0FBRXpDLHdFQUF3RTtBQUV4RSxNQUFNLFVBQVUsU0FBUyxDQUFDLElBQW1CLEVBQUUsSUFBWTtJQUN6RCxPQUE4QixJQUFJLENBQUMsSUFBSyxDQUFDLElBQUksS0FBSyxJQUFJLENBQUM7QUFDekQsQ0FBQztBQUVELE1BQU0sVUFBVSxXQUFXLENBQUMsSUFBWTtJQUN0QyxPQUFPLENBQUMsSUFBSSxFQUFFLEVBQUUsQ0FBQyxTQUFTLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO0FBQ3pDLENBQUM7QUFHRCxNQUFNLFVBQVUsWUFBWSxDQUMxQixJQUFnRSxFQUNoRSxJQUFZO0lBRVosSUFBSSxJQUFJLENBQUM7SUFDVCxJQUFJLElBQUksWUFBWSxvQkFBb0IsRUFBRTtRQUN4QyxJQUFJLEdBQUcsSUFBSSxDQUFDO0tBQ2I7U0FBTTtRQUNMLElBQUksR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDO0tBQ3pCO0lBQ0QsZ0NBQWdDO0lBQ2hDLE9BQU8sSUFBSSxDQUFDLFVBQVUsRUFBRSxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDO0FBQzFELENBQUM7QUFFRCxNQUFNLFVBQVUsWUFBWSxDQUMxQixJQUEwQixFQUMxQixJQUFZO0lBRVosT0FBTyxJQUFJLENBQUMsVUFBVSxFQUFFLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUUsQ0FBQztBQUNuRCxDQUFDO0FBRUQsTUFBTSxVQUFVLFNBQVMsQ0FBQyxJQUFZO0lBQ3BDLE9BQU8sSUFBSSxDQUFDLFNBQVMsSUFBSSxJQUFJLENBQUMsWUFBWSxDQUFDLFVBQVUsQ0FBQyxVQUFVLENBQUMsQ0FBQztBQUNwRSxDQUFDO0FBRUQsTUFBTSxVQUFVLEdBQUcsQ0FBSSxFQUFxQjtJQUMxQyxPQUFPLENBQUMsQ0FBSSxFQUFFLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUMxQixDQUFDO0FBRUQsTUFBTSxVQUFVLFFBQVEsQ0FBQyxJQUFVO0lBQ2pDLE9BQU8sVUFBVSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUNoQyxDQUFDO0FBTUQsTUFBTSxPQUFPLEdBQUcsVUFBVSxDQUFDO0FBRzNCLE1BQU0sVUFBVSxPQUFPLENBQUMsSUFBNkI7SUFDbkQsSUFBSSxJQUFJLFlBQVksUUFBUSxFQUFFO1FBQzVCLElBQUksSUFBSSxZQUFZLGFBQWEsRUFBRTtZQUNqQyxJQUFJLElBQUksR0FBRyxXQUFXLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFBO1lBQ2pDLE1BQU0sY0FBYyxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUM7WUFDMUMsSUFBSSxjQUFjLElBQUksY0FBYyxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7Z0JBQy9DLElBQUksSUFBSSxJQUFJLGNBQWMsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUM7YUFDdkQ7WUFDRCxJQUFJLElBQUksQ0FBQyxVQUFVLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFO2dCQUMxQyxJQUFJLEdBQUcsR0FBRyxJQUFJLFNBQVMsQ0FBQzthQUN6QjtZQUNELE9BQU8sSUFBSSxDQUFBO1NBQ1o7YUFBTSxJQUFJLElBQUksWUFBWSxRQUFRLEVBQUU7WUFDbkMsT0FBTyxRQUFRLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFBO1NBQ2pDO1FBQ0QsT0FBTyxFQUFFLENBQUM7S0FDWDtJQUNELElBQUksSUFBSSxZQUFZLGdCQUFnQixJQUFJLElBQUksWUFBWSxvQkFBb0IsSUFBSSxJQUFJLFlBQVksbUJBQW1CLEVBQUU7UUFDbkgsT0FBTyxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUM7S0FDeEI7SUFDRCxPQUFPLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDN0IsQ0FBQztBQUdELE1BQU0sVUFBVSxXQUFXLENBQUMsSUFBYztJQUN4QyxJQUFJLElBQUksR0FBRyxRQUFRLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO0lBQ3JDLElBQUksSUFBSSxDQUFDLElBQUksRUFBRTtRQUNiLElBQUksSUFBSSxXQUFXLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0tBQ2hDO0lBQ0QsT0FBTyxJQUFJLENBQUM7QUFFZCxDQUFDO0FBRUQsTUFBTSxVQUFVLFNBQVMsQ0FBaUIsSUFBTztJQUMvQyxPQUFPLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUN6QixDQUFDO0FBRUQsTUFBTSxVQUFVLFdBQVcsQ0FBQyxJQUFVO0lBQ3BDLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsVUFBVSxJQUFJLFVBQVUsQ0FBQyxVQUFVLENBQUM7QUFDL0QsQ0FBQztBQUVELE1BQU0sVUFBVSxPQUFPLENBQUMsSUFBVTtJQUNoQyxPQUFPLFdBQVcsQ0FBQyxJQUFJLENBQUMsSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxVQUFVLElBQUksVUFBVSxDQUFDLGFBQWEsQ0FBQztBQUN2RixDQUFDO0FBRUQsTUFBTSxVQUFVLFNBQVMsQ0FBQyxNQUFzRTtJQUM5RixJQUFJLElBQUksR0FBRyxRQUFRLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFBO0lBQ2hDLE1BQU0sY0FBYyxHQUFHLE1BQU0sQ0FBQyxjQUFjLENBQUM7SUFDN0MsSUFBSSxjQUFjLEVBQUU7UUFDbEIsSUFBSSxJQUFJLElBQUksY0FBYyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQztLQUN2RDtJQUNELE9BQU8sSUFBSSxDQUFDO0FBQ2QsQ0FBQztBQUVELE1BQU0sVUFBVSxhQUFhLENBQUMsSUFBWTtJQUN4QyxPQUFPLENBQUMsSUFBMEIsRUFBRSxFQUFFLENBQUMsSUFBSSxDQUFDLElBQUksSUFBSSxRQUFRLENBQUMsaUJBQWlCLElBQUksUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxJQUFJLENBQUM7QUFDakgsQ0FBQztBQUVELE1BQU0sVUFBVSxZQUFZLENBQUMsT0FBZ0IsRUFBRSxTQUFpQjtJQUM5RCxNQUFNLE9BQU8sR0FBRyxPQUFPLENBQUMsT0FBTyxDQUFDO0lBQ2hDLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLEdBQUcsR0FBRyxPQUFPLENBQUMsTUFBTSxFQUFFLENBQUMsR0FBRyxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUU7UUFDaEQsSUFBSSxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsWUFBWSxJQUFJLFNBQVMsQ0FBQyxZQUFZLEVBQUU7WUFDbkQsT0FBTyxDQUFDLENBQUMsQ0FBQyxHQUFHLFNBQVMsQ0FBQztZQUN2QixNQUFNO1NBQ1Q7S0FDSjtBQUNILENBQUM7QUFFRCxNQUFNLE9BQU8sYUFBYTtJQUNoQixFQUFFLEdBQWEsRUFBRSxDQUFDO0lBRTFCLElBQUksQ0FBQyxDQUFTO1FBQ1osSUFBSSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDbEIsQ0FBQztJQUVELE1BQU0sQ0FBQyxTQUFTLEdBQUcsSUFBSTtRQUNyQixJQUFJLEdBQUcsR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUNsQyxJQUFJLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQztRQUNiLE9BQU8sR0FBRyxDQUFDO0lBQ2IsQ0FBQztJQUVELElBQUssSUFBSSxLQUFhLE9BQU8sSUFBSSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLE1BQU0sR0FBRSxDQUFDLENBQUMsQ0FBQSxDQUFBLENBQUM7Q0FDekQ7QUFFRDs7OztHQUlHO0FBQ0YsTUFBTSxVQUFVLGVBQWUsQ0FBQyxPQUEwQjtJQUN6RCxPQUFPLFVBQVUsQ0FBQyxPQUFPLEVBQUUsa0JBQWtCLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDdkQsQ0FBQztBQUVEOzs7O0VBSUU7QUFDRixNQUFNLFVBQVUsaUJBQWlCLENBQUMsT0FBMEI7SUFDMUQsT0FBTyxVQUFVLENBQUMsT0FBTyxFQUFFLGtCQUFrQixDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBQ3pELENBQUM7QUFFRDs7OztFQUlFO0FBQ0YsTUFBTSxVQUFVLFVBQVUsQ0FDeEIsT0FBMEIsRUFDMUIsUUFBNEI7SUFFNUIsTUFBTSxXQUFXLEdBQUcsT0FBTyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDO0lBQ25FLEtBQUssTUFBTSxHQUFHLElBQUksV0FBVyxFQUFFO1FBQzNCLElBQUksR0FBRyxDQUFDLFFBQVEsS0FBSyxRQUFRLEVBQUU7WUFDM0IsT0FBTyxJQUFJLENBQUM7U0FDZjtLQUNKO0lBQ0QsT0FBTyxLQUFLLENBQUM7QUFDZixDQUFDO0FBR0QsSUFBSSxhQUFhLEdBQ2YsMlJBQTJSLENBQUM7QUFFOVIsTUFBTSxVQUFVLFFBQVEsQ0FBQyxDQUE0QjtJQUNuRCxJQUFJLE1BQU0sR0FBRyxDQUFDLFlBQVksTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDO0lBQ3RELE9BQU8sYUFBYSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsWUFBWSxDQUFDLENBQUM7QUFDakQsQ0FBQztBQUVELE1BQU0sQ0FBQyxNQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcbiAgRGVjb3JhdG9yTm9kZSxcbiAgSWRlbnRpZmllckV4cHJlc3Npb24sXG4gIERlY2xhcmF0aW9uU3RhdGVtZW50LFxuICBTb3VyY2UsXG4gIE5vZGUsXG4gIFNvdXJjZUtpbmQsXG4gIFByb2dyYW0sXG4gIENsYXNzRGVjbGFyYXRpb24sXG4gIFR5cGVOb2RlLFxuICBOb2RlS2luZCxcbiAgSW50ZXJmYWNlRGVjbGFyYXRpb24sXG4gIEZ1bmN0aW9uRGVjbGFyYXRpb24sXG4gIFR5cGVOYW1lLFxuICBEaWFnbm9zdGljQ2F0ZWdvcnksXG4gIERpYWdub3N0aWNFbWl0dGVyLFxuICBOYW1lZFR5cGVOb2RlLFxuICBSYW5nZSxcbiAgdXRpbCxcbn0gZnJvbSBcImFzc2VtYmx5c2NyaXB0L2Rpc3QvYXNzZW1ibHlzY3JpcHQuanNcIjtcbmltcG9ydCB7IEFTVEJ1aWxkZXIgfSBmcm9tIFwiLi9hc3RCdWlsZGVyLmpzXCI7XG5pbXBvcnQgY2xvbmVEZWVwIGZyb20gXCJsb2Rhc2guY2xvbmVkZWVwXCI7XG5cbi8vIGNvbnN0IGNsb25lRGVlcDogPFQ+KHQ6IFQpID0+IFQgPSByZXF1aXJlKFwibG9kYXNoLmNsb25lZGVlcFwiKSBhcyBhbnk7XG5cbmV4cG9ydCBmdW5jdGlvbiBkZWNvcmF0ZXMobm9kZTogRGVjb3JhdG9yTm9kZSwgbmFtZTogc3RyaW5nKTogYm9vbGVhbiB7XG4gIHJldHVybiAoPElkZW50aWZpZXJFeHByZXNzaW9uPm5vZGUubmFtZSkudGV4dCA9PT0gbmFtZTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzRGVjb3JhdG9yKG5hbWU6IHN0cmluZyk6IChub2RlOiBEZWNvcmF0b3JOb2RlKSA9PiBib29sZWFuIHtcbiAgcmV0dXJuIChub2RlKSA9PiBkZWNvcmF0ZXMobm9kZSwgbmFtZSk7XG59XG5cblxuZXhwb3J0IGZ1bmN0aW9uIGhhc0RlY29yYXRvcihcbiAgbm9kZTogRGVjbGFyYXRpb25TdGF0ZW1lbnQgfCB7ZGVjbGFyYXRpb246IERlY2xhcmF0aW9uU3RhdGVtZW50fSxcbiAgbmFtZTogc3RyaW5nXG4pOiBib29sZWFuIHtcbiAgbGV0IGRlY2w7XG4gIGlmIChub2RlIGluc3RhbmNlb2YgRGVjbGFyYXRpb25TdGF0ZW1lbnQpIHtcbiAgICBkZWNsID0gbm9kZTtcbiAgfSBlbHNlIHtcbiAgICBkZWNsID0gbm9kZS5kZWNsYXJhdGlvbjsgXG4gIH0gXG4gIC8vIGJlY2F1c2UgaXQgY291bGQgYmUgdW5kZWZpbmVkXG4gIHJldHVybiBkZWNsLmRlY29yYXRvcnM/LnNvbWUoaXNEZWNvcmF0b3IobmFtZSkpID09IHRydWU7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXREZWNvcmF0b3IoXG4gIG5vZGU6IERlY2xhcmF0aW9uU3RhdGVtZW50LFxuICBuYW1lOiBzdHJpbmdcbik6IERlY29yYXRvck5vZGUge1xuICByZXR1cm4gbm9kZS5kZWNvcmF0b3JzPy5maW5kKGlzRGVjb3JhdG9yKG5hbWUpKSE7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc0xpYnJhcnkobm9kZTogU291cmNlKTogYm9vbGVhbiB7XG4gIHJldHVybiBub2RlLmlzTGlicmFyeSB8fCBub2RlLmludGVybmFsUGF0aC5zdGFydHNXaXRoKFwifmxpYi9ydC9cIik7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBub3Q8VD4oZm46ICh0OiBUKSA9PiBib29sZWFuKTogKHQ6IFQpID0+IGJvb2xlYW4ge1xuICByZXR1cm4gKHQ6IFQpID0+ICFmbih0KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHRvU3RyaW5nKG5vZGU6IE5vZGUpOiBzdHJpbmcge1xuICByZXR1cm4gQVNUQnVpbGRlci5idWlsZChub2RlKTtcbn1cblxuaW50ZXJmYWNlIE5hbWVkIHtcbiAgbmFtZTogSWRlbnRpZmllckV4cHJlc3Npb247XG59XG5cbmNvbnN0IE9SX05VTEwgPSAvXFx8LipudWxsLztcblxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0TmFtZShub2RlOiBOb2RlICYgTmFtZWQgfCBUeXBlTm9kZSk6IHN0cmluZyB7XG4gIGlmIChub2RlIGluc3RhbmNlb2YgVHlwZU5vZGUpIHtcbiAgICBpZiAobm9kZSBpbnN0YW5jZW9mIE5hbWVkVHlwZU5vZGUpIHtcbiAgICAgIGxldCBuYW1lID0gZ2V0VHlwZU5hbWUobm9kZS5uYW1lKVxuICAgICAgY29uc3QgdHlwZVBhcmFtZXRlcnMgPSBub2RlLnR5cGVBcmd1bWVudHM7XG4gICAgICBpZiAodHlwZVBhcmFtZXRlcnMgJiYgdHlwZVBhcmFtZXRlcnMubGVuZ3RoID4gMCkge1xuICAgICAgICBuYW1lICs9IGA8JHt0eXBlUGFyYW1ldGVycy5tYXAoZ2V0TmFtZSkuam9pbihcIiwgXCIpfT5gO1xuICAgICAgfVxuICAgICAgaWYgKG5vZGUuaXNOdWxsYWJsZSAmJiAhT1JfTlVMTC50ZXN0KG5hbWUpKSB7XG4gICAgICAgIG5hbWUgPSBgJHtuYW1lfSB8IG51bGxgO1xuICAgICAgfVxuICAgICAgcmV0dXJuIG5hbWVcbiAgICB9IGVsc2UgaWYgKG5vZGUgaW5zdGFuY2VvZiBUeXBlTmFtZSkge1xuICAgICAgcmV0dXJuIHRvU3RyaW5nKG5vZGUuaWRlbnRpZmllcilcbiAgICB9XG4gICAgcmV0dXJuIFwiXCI7XG4gIH1cbiAgaWYgKG5vZGUgaW5zdGFuY2VvZiBDbGFzc0RlY2xhcmF0aW9uIHx8IG5vZGUgaW5zdGFuY2VvZiBJbnRlcmZhY2VEZWNsYXJhdGlvbiB8fCBub2RlIGluc3RhbmNlb2YgRnVuY3Rpb25EZWNsYXJhdGlvbikge1xuICAgIHJldHVybiBjbGFzc05hbWUobm9kZSk7XG4gIH0gXG4gIHJldHVybiB0b1N0cmluZyhub2RlLm5hbWUpO1xufVxuXG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRUeXBlTmFtZShub2RlOiBUeXBlTmFtZSk6IHN0cmluZyB7XG4gIGxldCBuYW1lID0gdG9TdHJpbmcobm9kZS5pZGVudGlmaWVyKTtcbiAgaWYgKG5vZGUubmV4dCkge1xuICAgIG5hbWUgKz0gZ2V0VHlwZU5hbWUobm9kZS5uZXh0KTtcbiAgfVxuICByZXR1cm4gbmFtZTtcbiAgXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjbG9uZU5vZGU8VCBleHRlbmRzIE5vZGU+KG5vZGU6IFQpOiBUIHtcbiAgcmV0dXJuIGNsb25lRGVlcChub2RlKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzVXNlckVudHJ5KG5vZGU6IE5vZGUpOiBib29sZWFuIHtcbiAgcmV0dXJuIG5vZGUucmFuZ2Uuc291cmNlLnNvdXJjZUtpbmQgPT0gU291cmNlS2luZC5VU0VSX0VOVFJZO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNFbnRyeShub2RlOiBOb2RlKTogYm9vbGVhbiB7XG4gIHJldHVybiBpc1VzZXJFbnRyeShub2RlKSB8fCBub2RlLnJhbmdlLnNvdXJjZS5zb3VyY2VLaW5kID09IFNvdXJjZUtpbmQuTElCUkFSWV9FTlRSWTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNsYXNzTmFtZShfY2xhc3M6IENsYXNzRGVjbGFyYXRpb24gfCAgSW50ZXJmYWNlRGVjbGFyYXRpb24gfCBGdW5jdGlvbkRlY2xhcmF0aW9uKTogc3RyaW5nIHtcbiAgbGV0IG5hbWUgPSB0b1N0cmluZyhfY2xhc3MubmFtZSlcbiAgY29uc3QgdHlwZVBhcmFtZXRlcnMgPSBfY2xhc3MudHlwZVBhcmFtZXRlcnM7XG4gIGlmICh0eXBlUGFyYW1ldGVycykge1xuICAgIG5hbWUgKz0gYDwke3R5cGVQYXJhbWV0ZXJzLm1hcChnZXROYW1lKS5qb2luKFwiLCBcIil9PmA7XG4gIH1cbiAgcmV0dXJuIG5hbWU7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc01ldGhvZE5hbWVkKG5hbWU6IHN0cmluZyk6IChfOiBEZWNsYXJhdGlvblN0YXRlbWVudCkgPT4gYm9vbGVhbiB7XG4gIHJldHVybiAoc3RtdDogRGVjbGFyYXRpb25TdGF0ZW1lbnQpID0+IHN0bXQua2luZCA9PSBOb2RlS2luZC5NRVRIT0RERUNMQVJBVElPTiAmJiB0b1N0cmluZyhzdG10Lm5hbWUpID09PSBuYW1lO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gdXBkYXRlU291cmNlKHByb2dyYW06IFByb2dyYW0sIG5ld1NvdXJjZTogU291cmNlKSB7XG4gIGNvbnN0IHNvdXJjZXMgPSBwcm9ncmFtLnNvdXJjZXM7XG4gIGZvciAobGV0IGkgPSAwLCBsZW4gPSBzb3VyY2VzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICBpZiAoc291cmNlc1tpXS5pbnRlcm5hbFBhdGggPT0gbmV3U291cmNlLmludGVybmFsUGF0aCkge1xuICAgICAgICAgIHNvdXJjZXNbaV0gPSBuZXdTb3VyY2U7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIFN0cmluZ0J1aWxkZXIge1xuICBwcml2YXRlIHNiOiBzdHJpbmdbXSA9IFtdO1xuXG4gIHB1c2goczogc3RyaW5nKTogdm9pZCB7XG4gICAgdGhpcy5zYi5wdXNoKHMpO1xuICB9XG5cbiAgZmluaXNoKHNlcGFyYXRvciA9IFwiXFxuXCIpOiBzdHJpbmcge1xuICAgIGxldCByZXMgPSB0aGlzLnNiLmpvaW4oc2VwYXJhdG9yKTtcbiAgICB0aGlzLnNiID0gW107XG4gICAgcmV0dXJuIHJlcztcbiAgfVxuXG4gIGdldCAgbGFzdCgpOiBzdHJpbmcgeyByZXR1cm4gdGhpcy5zYlt0aGlzLnNiLmxlbmd0aCAtMV19XG59XG5cbi8qKlxuICpcbiAqIEBwYXJhbSBlbWl0dGVyIERpYWdub3N0aWNFbWl0dGVyXG4gKiBAcmV0dXJucyByZXR1cm4gdHJ1ZSBpZiBlbWl0dGVyIGhhdmUgRVJST1IgbWVzc2FnZVxuICovXG4gZXhwb3J0IGZ1bmN0aW9uIGhhc0Vycm9yTWVzc2FnZShlbWl0dGVyOiBEaWFnbm9zdGljRW1pdHRlcik6IGJvb2xlYW4ge1xuICByZXR1cm4gaGFzTWVzc2FnZShlbWl0dGVyLCBEaWFnbm9zdGljQ2F0ZWdvcnkuRVJST1IpO1xufVxuXG4vKipcbipcbiogQHBhcmFtIGVtaXR0ZXIgRGlhZ25vc3RpY0VtaXR0ZXJcbiogQHJldHVybnMgcmV0dXJuIHRydWUgaWYgZW1pdHRlciBoYXZlIFdBUk5JTkcgbWVzc2FnZVxuKi9cbmV4cG9ydCBmdW5jdGlvbiBoYXNXYXJuaW5nTWVzc2FnZShlbWl0dGVyOiBEaWFnbm9zdGljRW1pdHRlcik6IGJvb2xlYW4ge1xuICByZXR1cm4gaGFzTWVzc2FnZShlbWl0dGVyLCBEaWFnbm9zdGljQ2F0ZWdvcnkuV0FSTklORyk7XG59XG5cbi8qKlxuKlxuKiBAcGFyYW0gZW1pdHRlciBEaWFnbm9zdGljRW1pdHRlclxuKiBAcmV0dXJucyByZXR1cm4gdHJ1ZSBpZiBlbWl0dGVyIGhhdmUgYGNhdGVnb3J5YCBtZXNzYWdlXG4qL1xuZXhwb3J0IGZ1bmN0aW9uIGhhc01lc3NhZ2UoXG4gIGVtaXR0ZXI6IERpYWdub3N0aWNFbWl0dGVyLFxuICBjYXRlZ29yeTogRGlhZ25vc3RpY0NhdGVnb3J5XG4pOiBib29sZWFuIHtcbiAgY29uc3QgZGlhZ25vc3RpY3MgPSBlbWl0dGVyLmRpYWdub3N0aWNzID8gZW1pdHRlci5kaWFnbm9zdGljcyA6IFtdO1xuICBmb3IgKGNvbnN0IG1zZyBvZiBkaWFnbm9zdGljcykge1xuICAgICAgaWYgKG1zZy5jYXRlZ29yeSA9PT0gY2F0ZWdvcnkpIHtcbiAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cbiAgfVxuICByZXR1cm4gZmFsc2U7XG59XG5cblxubGV0IGlzU3RkbGliUmVnZXggPVxuICAvXFx+bGliXFwvKD86YXJyYXl8YXJyYXlidWZmZXJ8YXRvbWljc3xidWlsdGluc3xjcnlwdG98Y29uc29sZXxjb21wYXR8ZGF0YXZpZXd8ZGF0ZXxkaWFnbm9zdGljc3xlcnJvcnxmdW5jdGlvbnxpdGVyYXRvcnxtYXB8bWF0aHxudW1iZXJ8b2JqZWN0fHByb2Nlc3N8cmVmZXJlbmNlfHJlZ2V4cHxzZXR8c3RhdGljYXJyYXl8c3RyaW5nfHN5bWJvbHx0YWJsZXx0eXBlZGFycmF5fHZlY3RvcnxydFxcLz98YmluZGluZ3NcXC98c2hhcmVkXFwvdHlwZWluZm8pfHV0aWxcXC98dXJpfHBvbHlmaWxsc3xtZW1vcnkvO1xuXG5leHBvcnQgZnVuY3Rpb24gaXNTdGRsaWIoczogU291cmNlIHwgeyByYW5nZTogUmFuZ2UgfSk6IGJvb2xlYW4ge1xuICBsZXQgc291cmNlID0gcyBpbnN0YW5jZW9mIFNvdXJjZSA/IHMgOiBzLnJhbmdlLnNvdXJjZTtcbiAgcmV0dXJuIGlzU3RkbGliUmVnZXgudGVzdChzb3VyY2UuaW50ZXJuYWxQYXRoKTtcbn1cblxuZXhwb3J0IGNvbnN0IGluZGVudCA9IHV0aWwuaW5kZW50O1xuIl19