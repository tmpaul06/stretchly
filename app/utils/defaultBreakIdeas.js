module.exports = [
  { data: ['Design Patterns',  `# Single Responsibility Principle (S in SOLID)

> The Single Responsibility Principle (SRP) states that a class should have only one reason to change.

> e.g Car's function is driving. \`giveFuelToEngine\` does not belong in car.

\`\`\`
    class Car {
        public function construct() {}

        public function drive() {
            //
        }

        public function giveFuelToEngine() {

        }
    }
\`\`\`

`], enabled: true }
]
