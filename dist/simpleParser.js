import { Parser, Tokenizer, Source, SourceKind, } from "assemblyscript/dist/assemblyscript.js";
export class SimpleParser {
    static get parser() {
        return new Parser();
    }
    static getTokenizer(s, file = "index.ts") {
        return new Tokenizer(new Source(SourceKind.USER, file, s));
    }
    static parseExpression(s) {
        const res = this.parser.parseExpression(this.getTokenizer(s));
        if (res == null) {
            throw new Error("Failed to parse the expression: '" + s + "'");
        }
        return res;
    }
    static parseStatement(s, topLevel = false) {
        const res = this.parser.parseStatement(this.getTokenizer(s), topLevel);
        if (res == null) {
            throw new Error("Failed to parse the statement: '" + s + "'");
        }
        return res;
    }
    static parseTopLevelStatement(s, namespace) {
        const res = this.parser.parseTopLevelStatement(this.getTokenizer(s), namespace);
        if (res == null) {
            throw new Error("Failed to parse the top level statement: '" + s + "'");
        }
        return res;
    }
    static parseClassMember(s, _class) {
        let res = this.parser.parseClassMember(this.getTokenizer(s, _class.range.source.normalizedPath), _class);
        if (res == null) {
            throw new Error("Failed to parse the class member: '" + s + "'");
        }
        return res;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2ltcGxlUGFyc2VyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL3NpbXBsZVBhcnNlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQ0wsTUFBTSxFQUNOLFNBQVMsRUFDVCxNQUFNLEVBQ04sVUFBVSxHQU1YLE1BQU0sdUNBQXVDLENBQUM7QUFHL0MsTUFBTSxPQUFPLFlBQVk7SUFDZixNQUFNLEtBQUssTUFBTTtRQUN2QixPQUFPLElBQUksTUFBTSxFQUFFLENBQUM7SUFDdEIsQ0FBQztJQUVPLE1BQU0sQ0FBQyxZQUFZLENBQUMsQ0FBUyxFQUFFLE9BQWUsVUFBVTtRQUM5RCxPQUFPLElBQUksU0FBUyxDQUFDLElBQUksTUFBTSxDQUFDLFVBQVUsQ0FBQyxJQUFJLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDN0QsQ0FBQztJQUVELE1BQU0sQ0FBQyxlQUFlLENBQUMsQ0FBUztRQUM5QixNQUFNLEdBQUcsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDOUQsSUFBSSxHQUFHLElBQUksSUFBSSxFQUFFO1lBQ2YsTUFBTSxJQUFJLEtBQUssQ0FBQyxtQ0FBbUMsR0FBRyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUM7U0FDaEU7UUFDRCxPQUFPLEdBQUcsQ0FBQztJQUNiLENBQUM7SUFFRCxNQUFNLENBQUMsY0FBYyxDQUFDLENBQVMsRUFBRSxRQUFRLEdBQUcsS0FBSztRQUMvQyxNQUFNLEdBQUcsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxFQUFFLFFBQVEsQ0FBQyxDQUFDO1FBQ3ZFLElBQUksR0FBRyxJQUFJLElBQUksRUFBRTtZQUNmLE1BQU0sSUFBSSxLQUFLLENBQUMsa0NBQWtDLEdBQUcsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDO1NBQy9EO1FBQ0QsT0FBTyxHQUFHLENBQUM7SUFDYixDQUFDO0lBRUQsTUFBTSxDQUFDLHNCQUFzQixDQUMzQixDQUFTLEVBQ1QsU0FBdUM7UUFFdkMsTUFBTSxHQUFHLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxzQkFBc0IsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxFQUFFLFNBQVMsQ0FBQyxDQUFDO1FBQ2hGLElBQUksR0FBRyxJQUFJLElBQUksRUFBRTtZQUNmLE1BQU0sSUFBSSxLQUFLLENBQUMsNENBQTRDLEdBQUcsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDO1NBQ3pFO1FBQ0QsT0FBTyxHQUFHLENBQUM7SUFDYixDQUFDO0lBRUQsTUFBTSxDQUFDLGdCQUFnQixDQUFDLENBQVMsRUFBRSxNQUF3QjtRQUN6RCxJQUFJLEdBQUcsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLGdCQUFnQixDQUNwQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUMsRUFBRSxNQUFNLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxjQUFjLENBQUMsRUFDeEQsTUFBTSxDQUNQLENBQUM7UUFDRixJQUFJLEdBQUcsSUFBSSxJQUFJLEVBQUU7WUFDZixNQUFNLElBQUksS0FBSyxDQUFDLHFDQUFxQyxHQUFHLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQztTQUNsRTtRQUNELE9BQTZCLEdBQUcsQ0FBQztJQUNuQyxDQUFDO0NBQ0YiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xuICBQYXJzZXIsXG4gIFRva2VuaXplcixcbiAgU291cmNlLFxuICBTb3VyY2VLaW5kLFxuICBFeHByZXNzaW9uLFxuICBTdGF0ZW1lbnQsXG4gIE5hbWVzcGFjZURlY2xhcmF0aW9uLFxuICBDbGFzc0RlY2xhcmF0aW9uLFxuICBEZWNsYXJhdGlvblN0YXRlbWVudCxcbn0gZnJvbSBcImFzc2VtYmx5c2NyaXB0L2Rpc3QvYXNzZW1ibHlzY3JpcHQuanNcIjtcbmltcG9ydCB7IFJhbmdlVHJhbnNmb3JtIH0gZnJvbSBcIi4vdHJhbnNmb3JtUmFuZ2UuanNcIjtcblxuZXhwb3J0IGNsYXNzIFNpbXBsZVBhcnNlciB7XG4gIHByaXZhdGUgc3RhdGljIGdldCBwYXJzZXIoKTogUGFyc2VyIHtcbiAgICByZXR1cm4gbmV3IFBhcnNlcigpO1xuICB9XG5cbiAgcHJpdmF0ZSBzdGF0aWMgZ2V0VG9rZW5pemVyKHM6IHN0cmluZywgZmlsZTogc3RyaW5nID0gXCJpbmRleC50c1wiKTogVG9rZW5pemVyIHtcbiAgICByZXR1cm4gbmV3IFRva2VuaXplcihuZXcgU291cmNlKFNvdXJjZUtpbmQuVVNFUiwgZmlsZSwgcykpO1xuICB9XG5cbiAgc3RhdGljIHBhcnNlRXhwcmVzc2lvbihzOiBzdHJpbmcpOiBFeHByZXNzaW9uIHtcbiAgICBjb25zdCByZXMgPSB0aGlzLnBhcnNlci5wYXJzZUV4cHJlc3Npb24odGhpcy5nZXRUb2tlbml6ZXIocykpO1xuICAgIGlmIChyZXMgPT0gbnVsbCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiRmFpbGVkIHRvIHBhcnNlIHRoZSBleHByZXNzaW9uOiAnXCIgKyBzICsgXCInXCIpO1xuICAgIH1cbiAgICByZXR1cm4gcmVzO1xuICB9XG5cbiAgc3RhdGljIHBhcnNlU3RhdGVtZW50KHM6IHN0cmluZywgdG9wTGV2ZWwgPSBmYWxzZSk6IFN0YXRlbWVudCB7XG4gICAgY29uc3QgcmVzID0gdGhpcy5wYXJzZXIucGFyc2VTdGF0ZW1lbnQodGhpcy5nZXRUb2tlbml6ZXIocyksIHRvcExldmVsKTtcbiAgICBpZiAocmVzID09IG51bGwpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcIkZhaWxlZCB0byBwYXJzZSB0aGUgc3RhdGVtZW50OiAnXCIgKyBzICsgXCInXCIpO1xuICAgIH1cbiAgICByZXR1cm4gcmVzO1xuICB9XG5cbiAgc3RhdGljIHBhcnNlVG9wTGV2ZWxTdGF0ZW1lbnQoXG4gICAgczogc3RyaW5nLFxuICAgIG5hbWVzcGFjZT86IE5hbWVzcGFjZURlY2xhcmF0aW9uIHwgbnVsbFxuICApOiBTdGF0ZW1lbnQge1xuICAgIGNvbnN0IHJlcyA9IHRoaXMucGFyc2VyLnBhcnNlVG9wTGV2ZWxTdGF0ZW1lbnQodGhpcy5nZXRUb2tlbml6ZXIocyksIG5hbWVzcGFjZSk7XG4gICAgaWYgKHJlcyA9PSBudWxsKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJGYWlsZWQgdG8gcGFyc2UgdGhlIHRvcCBsZXZlbCBzdGF0ZW1lbnQ6ICdcIiArIHMgKyBcIidcIik7XG4gICAgfVxuICAgIHJldHVybiByZXM7XG4gIH1cblxuICBzdGF0aWMgcGFyc2VDbGFzc01lbWJlcihzOiBzdHJpbmcsIF9jbGFzczogQ2xhc3NEZWNsYXJhdGlvbik6IERlY2xhcmF0aW9uU3RhdGVtZW50IHtcbiAgICBsZXQgcmVzID0gdGhpcy5wYXJzZXIucGFyc2VDbGFzc01lbWJlcihcbiAgICAgIHRoaXMuZ2V0VG9rZW5pemVyKHMsIF9jbGFzcy5yYW5nZS5zb3VyY2Uubm9ybWFsaXplZFBhdGgpLFxuICAgICAgX2NsYXNzXG4gICAgKTtcbiAgICBpZiAocmVzID09IG51bGwpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcIkZhaWxlZCB0byBwYXJzZSB0aGUgY2xhc3MgbWVtYmVyOiAnXCIgKyBzICsgXCInXCIpO1xuICAgIH1cbiAgICByZXR1cm4gPERlY2xhcmF0aW9uU3RhdGVtZW50PnJlcztcbiAgfVxufVxuIl19