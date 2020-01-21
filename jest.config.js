module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
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