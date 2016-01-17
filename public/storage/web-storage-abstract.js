export default function factory(driver) {
    return class {
        constructor(name, load=true) {
            this.name = name;
            this.items = [];

            if (!load) {
                return;
            }

            this.load();
        }

        find(filter) {
            return this.items.filter(filter);
        }

        add(item, commit=true) {
            this.items.push(item);
            this.commit(commit);
        }

        remove(filter, commit=true) {
            this.items = this.items.filter((el) => !filter(el));
            this.commit(commit);
        }

        replace(filter, item, commit=true) {
            this.remove(filter, false);
            this.add(item);
            this.commit(commit);
        }

        load() {
            var str = driver[this.name];

            if (str === undefined) {
                console.info(`No stored data - initializing ${driver.constructor.name}`);
                this.items = [];
                return;
            }

            try {
                this.items = JSON.parse(str);
            } catch (e) {
                if (e instanceof SyntaxError) {
                    throw `Loaded data cannot be parsed. Trying: JSON.parse('${str}')`;
                }
            }

            if (!this.items.push || !this.items.filter) {
                throw 'Loaded items are invalid - must support .push() and .filter()';
            }
        }

        commit(commit=true) {
            if (!commit) {
                return;
            }

            var str = JSON.stringify(this.items);
            driver[this.name] = str;
        }
    }
}