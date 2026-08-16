/*
Composite = compose objects in tree structures and then work as they were individual objects.
- use it only when your app can be represented as a tree.

# Problem
- Your usecase is well represented as a tree and you require to apply some logic for all pieces of this big structure top to bottom.
- For example: you have directories and files and you want to count its total size recursively.
- Another example: You want to know the headcount on specific company's teams based on the managers.

# Solution
- Component interface = common interface for all components (leaves and composites).
- Leaf = Component that doesn't contain any new children (leaf of a tree).
- Composite = Container that contains all its children components.
  --> it also implements the component interface, so it can be part of the "children" and it works seamlessly.
- Client = uses composites without caring whether they are leaves or composites.
*/

// component interface
interface Employee {
  getHeadcount(): number;
}

// leaf -> no children
class Developer implements Employee {
  getHeadcount(): number {
    return 1;
  }
}

// composite (contains children = team[]) but is also an employee
class Manager implements Employee {
  private team: Employee[] = [];
  add(member: Employee): void {
    this.team.push(member);
  }
  getHeadcount(): number {
    return 1 + this.team.reduce((total, member) => total + member.getHeadcount(), 0);
  }
}

const cto = new Manager();
const lead = new Manager();
cto.add(lead);
cto.add(new Developer());
lead.add(new Developer());
lead.add(new Developer());

// client uses it seamlessly (don't care if they are composite or not)
console.log(cto.getHeadcount()); // 5
