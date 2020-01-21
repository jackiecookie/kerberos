module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  transformIgnorePatterns:[],
  globals: {
    window: {},
    CustomEvent:function(name,data){
      return {
        name,
        data
      }
    }
  }
};