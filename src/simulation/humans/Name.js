export default class Name {

    constructor(lastName, firstName, middleName) {
        this.lastName = lastName;
        this.firstName = firstName;
        this.middleName = middleName;
    }

    get fullName() {
        return `${this.lastName} ${this.firstName} ${this.middleName}`;
    }

    get initials() {
        let firstNameChar = this.firstName.charAt(0);
        let middleNameChar = this.middleName.charAt(0);

        return `${this.lastName} ${firstNameChar}. ${middleNameChar}.`;
    }

    static from(fullName) {
        const [lastName, firstName, middleName] = fullName.trim().split(' ').map(s => s.trim());

        return new Name(lastName, firstName, middleName);
    }
}