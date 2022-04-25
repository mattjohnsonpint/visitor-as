import { ASTTransformVisitor } from "../index.js";
import { SimpleParser } from "../simpleParser.js";
import { not, isStdlib, isMethodNamed, getName } from '../utils.js';
class ToStringCallTransform extends ASTTransformVisitor {
    currentClass;
    fields;
    visitFieldDeclaration(node) {
        const name = getName(node);
        let rhs = `this.${name}.toString()`;
        this.fields.push(`sb.push(\`${name}: \${${rhs}}\`)`);
        super.visitFieldDeclaration(node);
    }
    visitClassDeclaration(node) {
        if (!node.members || node.members.some(isMethodNamed("toString"))) {
            super.visitClassDeclaration(node);
            return;
        }
        this.currentClass = node;
        this.fields = [];
        this.visit(node.members); // will visit fields and methods
        const method = `
  toString(): string {
    const sb = new Array<string>();
    ${this.fields.join(";\n\t")};
    return \`${getName(node)}:\\n\\t\${sb.join("\\n\\t")}\`
  }
    `;
        let member = SimpleParser.parseClassMember(method, node);
        node.members.push(member);
        super.visitClassDeclaration(node);
    }
    afterParse(_) {
        let sources = _.sources.filter(not(isStdlib));
        this.visit(sources);
    }
}
export default ToStringCallTransform;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidG9TdHJpbmcuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvZXhhbXBsZXMvdG9TdHJpbmcudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLG1CQUFtQixFQUFFLE1BQU0sYUFBYSxDQUFDO0FBRWxELE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxvQkFBb0IsQ0FBQztBQUNsRCxPQUFPLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBdUIsYUFBYSxFQUFFLE9BQU8sRUFBRSxNQUFNLGFBQWEsQ0FBQztBQUl6RixNQUFNLHFCQUFzQixTQUFRLG1CQUFtQjtJQUNyRCxZQUFZLENBQW9CO0lBQ2hDLE1BQU0sQ0FBWTtJQUVsQixxQkFBcUIsQ0FBQyxJQUFzQjtRQUMxQyxNQUFNLElBQUksR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDM0IsSUFBSSxHQUFHLEdBQUcsUUFBUSxJQUFJLGFBQWEsQ0FBQztRQUNwQyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxhQUFhLElBQUksUUFBUSxHQUFHLE1BQU0sQ0FBQyxDQUFDO1FBQ3JELEtBQUssQ0FBQyxxQkFBcUIsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUNwQyxDQUFDO0lBR0QscUJBQXFCLENBQUMsSUFBc0I7UUFDMUMsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLFVBQVUsQ0FBQyxDQUFDLEVBQUU7WUFDakUsS0FBSyxDQUFDLHFCQUFxQixDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ2xDLE9BQU87U0FDUjtRQUVELElBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDO1FBQ3pCLElBQUksQ0FBQyxNQUFNLEdBQUcsRUFBRSxDQUFDO1FBQ2pCLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsZ0NBQWdDO1FBQzFELE1BQU0sTUFBTSxHQUFHOzs7TUFHYixJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUM7ZUFDaEIsT0FBTyxDQUFDLElBQUksQ0FBQzs7S0FFdkIsQ0FBQTtRQUNELElBQUksTUFBTSxHQUFHLFlBQVksQ0FBQyxnQkFBZ0IsQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDekQsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDMUIsS0FBSyxDQUFDLHFCQUFxQixDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ3BDLENBQUM7SUFFRCxVQUFVLENBQUMsQ0FBUztRQUNsQixJQUFJLE9BQU8sR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztRQUM5QyxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQ3RCLENBQUM7Q0FFRjtBQUdELGVBQWUscUJBQXFCLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBBU1RUcmFuc2Zvcm1WaXNpdG9yIH0gZnJvbSBcIi4uL2luZGV4LmpzXCI7XG5pbXBvcnQgeyBQYXJzZXIsIENsYXNzRGVjbGFyYXRpb24sIEZpZWxkRGVjbGFyYXRpb24gfSBmcm9tIFwiYXNzZW1ibHlzY3JpcHQvZGlzdC9hc3NlbWJseXNjcmlwdC5qc1wiO1xuaW1wb3J0IHsgU2ltcGxlUGFyc2VyIH0gZnJvbSBcIi4uL3NpbXBsZVBhcnNlci5qc1wiO1xuaW1wb3J0IHsgbm90LCBpc1N0ZGxpYiwgY2xhc3NOYW1lLCB0b1N0cmluZywgaXNNZXRob2ROYW1lZCwgZ2V0TmFtZSB9IGZyb20gJy4uL3V0aWxzLmpzJztcblxuXG5cbmNsYXNzIFRvU3RyaW5nQ2FsbFRyYW5zZm9ybSBleHRlbmRzIEFTVFRyYW5zZm9ybVZpc2l0b3Ige1xuICBjdXJyZW50Q2xhc3M/OiBDbGFzc0RlY2xhcmF0aW9uO1xuICBmaWVsZHMhOiBzdHJpbmdbXTtcblxuICB2aXNpdEZpZWxkRGVjbGFyYXRpb24obm9kZTogRmllbGREZWNsYXJhdGlvbik6IHZvaWQge1xuICAgIGNvbnN0IG5hbWUgPSBnZXROYW1lKG5vZGUpO1xuICAgIGxldCByaHMgPSBgdGhpcy4ke25hbWV9LnRvU3RyaW5nKClgO1xuICAgIHRoaXMuZmllbGRzLnB1c2goYHNiLnB1c2goXFxgJHtuYW1lfTogXFwkeyR7cmhzfX1cXGApYCk7XG4gICAgc3VwZXIudmlzaXRGaWVsZERlY2xhcmF0aW9uKG5vZGUpO1xuICB9XG5cblxuICB2aXNpdENsYXNzRGVjbGFyYXRpb24obm9kZTogQ2xhc3NEZWNsYXJhdGlvbik6IHZvaWQge1xuICAgIGlmICghbm9kZS5tZW1iZXJzIHx8IG5vZGUubWVtYmVycy5zb21lKGlzTWV0aG9kTmFtZWQoXCJ0b1N0cmluZ1wiKSkpIHtcbiAgICAgIHN1cGVyLnZpc2l0Q2xhc3NEZWNsYXJhdGlvbihub2RlKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgXG4gICAgdGhpcy5jdXJyZW50Q2xhc3MgPSBub2RlO1xuICAgIHRoaXMuZmllbGRzID0gW107XG4gICAgdGhpcy52aXNpdChub2RlLm1lbWJlcnMpOyAvLyB3aWxsIHZpc2l0IGZpZWxkcyBhbmQgbWV0aG9kc1xuICAgIGNvbnN0IG1ldGhvZCA9IGBcbiAgdG9TdHJpbmcoKTogc3RyaW5nIHtcbiAgICBjb25zdCBzYiA9IG5ldyBBcnJheTxzdHJpbmc+KCk7XG4gICAgJHt0aGlzLmZpZWxkcy5qb2luKFwiO1xcblxcdFwiKX07XG4gICAgcmV0dXJuIFxcYCR7Z2V0TmFtZShub2RlKX06XFxcXG5cXFxcdFxcJHtzYi5qb2luKFwiXFxcXG5cXFxcdFwiKX1cXGBcbiAgfVxuICAgIGBcbiAgICBsZXQgbWVtYmVyID0gU2ltcGxlUGFyc2VyLnBhcnNlQ2xhc3NNZW1iZXIobWV0aG9kLCBub2RlKTtcbiAgICBub2RlLm1lbWJlcnMucHVzaChtZW1iZXIpO1xuICAgIHN1cGVyLnZpc2l0Q2xhc3NEZWNsYXJhdGlvbihub2RlKTtcbiAgfVxuXG4gIGFmdGVyUGFyc2UoXzogUGFyc2VyKTogdm9pZCB7XG4gICAgbGV0IHNvdXJjZXMgPSBfLnNvdXJjZXMuZmlsdGVyKG5vdChpc1N0ZGxpYikpO1xuICAgIHRoaXMudmlzaXQoc291cmNlcyk7XG4gIH1cbiAgXG59XG5cblxuZXhwb3J0IGRlZmF1bHQgVG9TdHJpbmdDYWxsVHJhbnNmb3JtO1xuIl19