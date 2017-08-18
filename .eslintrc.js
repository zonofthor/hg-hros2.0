module.exports = {
    "root": true,
    "env": {
        "browser": true,
        "es6": true       // es6 globals, not same as es6 syntax in parserOptions, true automatically sets es6 in parserOptions
    },
    "plugins": ["react"],
    "parserOptions": {
      "ecmaVersion": 6,
      "impliedStrict": true,
      "sourceType": "module",    // script is default
      "ecmaFeatures": {"jsx": true}
    },
    "extends": "airbnb",
    "rules": {
        "no-use-before-define": 0,
        "no-unused-vars": 1,
        "max-len": 0,
        "quotes": [0,"double"],
        "semi": 0,
        "no-extra-semi": 2,
        "no-var": 2,
        "prefer-arrow-callback": 2,
        "no-restricted-syntax": 1,
        "comma-dangle": 0,
        "default-case": 0,
        "no-nested-ternary":0,
        "react/prop-types":0,
        "no-case-declarations":0,
        "jsx-a11y/no-static-element-interactions":0
    }
}
