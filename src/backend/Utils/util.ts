import { faker } from "@faker-js/faker";

// Function for returning a random value from enum
export function getRandomEnumValue<T extends { [key: string]: string | number }>(
	enumObj: T,
): T[keyof T] {
	const enumValues = Object.values(enumObj);
	const randomIndex = Math.floor(Math.random() * enumValues.length);
	return enumValues[randomIndex] as T[keyof T];
}

// Function for returning a random value from YEAR enum
export function getRandomEnumValueFromYear<T extends { [key: string]: string | number }>(
	enumObj: T,
): T[keyof T] {
	const enumValues = Object.values(enumObj);
	const filteredValues = enumValues.filter((value) => typeof value === "number" )
	// console.log("utils" + "  " + enumValues +"  "+filteredValues);
	const randomIndex = Math.floor(Math.random() * filteredValues.length);
	return filteredValues[randomIndex] as T[keyof T];
}

//Function to generate random password
export function generatePassword(): string {
	const lowerCase = faker.string.alpha({ length: 1, casing: "lower" });
	const upperCase = faker.string.alpha({ length: 1, casing: "upper" });
	const number = faker.string.numeric(1);
	const specialChar = faker.helpers.arrayElement([
		"@",
		"$",
		"!",
		"%",
		"*",
		"?",
		"&",
	]);
	const otherChars = faker.string.alphanumeric({ length: 4 });

	const passwordArray = [lowerCase, upperCase, number, specialChar, ...otherChars];
	faker.helpers.shuffle(passwordArray);

	return passwordArray.join("");
}
