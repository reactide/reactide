/*jslint node: true*/
/*jslint expr: true*/
/*global describe, it*/
"use strict";

var should = require('should');
var emoji = require('../index');

describe("emoji.js", function () {
  describe("get(emoji)", function () {
    it("should return an emoji code", function () {
      var coffee = emoji.get('coffee');
      should.exist(coffee);
      coffee.should.be.exactly('☕️');
    });

    it("should support github flavored markdown emoji", function () {
      var coffee = emoji.get(':coffee:');
      should.exist(coffee);
      coffee.should.be.exactly('☕️');
    });
  });

  describe("random()", function () {
    it("should return a random emoji and the corresponding key", function () {
      var result = emoji.random();
      should.exist(result);
      should.exist(result.key);
      should.exist(result.emoji);
      result.emoji.should.be.exactly(emoji.get(result.key));
    });
  });

  describe("which(emoji_code)", function () {
    it("should return name of the emoji", function () {
      var coffee = emoji.which('☕️');
      should.exist(coffee);
      coffee.should.be.exactly('coffee');
    });
    it("should work for differently formed characters", function () {
      var umbrella = emoji.which('☔');
      should.exist(umbrella);
      umbrella.should.be.exactly('umbrella');
    });
    it("should return the same name for differently formed characters", function () {
      var umbrella1 = emoji.which('☔');
      should.exist(umbrella1);
      var umbrella2 = emoji.which('☔️');
      should.exist(umbrella2);
      umbrella1.should.equal(umbrella2);
    });
  });

  describe("emojify(str)", function () {
    it("should parse :emoji: in a string and replace them with the right emoji", function () {
      var coffee = emoji.emojify('I :heart:  :coffee:! -  :hushed::star::heart_eyes:  ::: test : : :+1:+');
      should.exist(coffee);
      coffee.should.be.exactly('I ❤️  ☕️! -  😯⭐️😍  ::: test : : 👍+');
    });
    it("should leave unknown emoji", function () {
      var coffee = emoji.emojify('I :unknown_emoji: :star: :another_one:');
      should.exist(coffee);
      coffee.should.be.exactly('I :unknown_emoji: ⭐️ :another_one:');
    });

    it("should replace unknown emoji using provided cb function", function () {
      var coffee = emoji.emojify('I :unknown_emoji: :star: :another_one:', function(name) {
        return name;
      });
      should.exist(coffee);
      coffee.should.be.exactly('I unknown_emoji ⭐️ another_one');
    });
  });

  it("should return an emoji code", function () {
    var coffee = emoji.emoji.coffee;
    should.exist(coffee);
    coffee.should.be.exactly('☕️');
  });

  describe("search(str)", function () {
    it("should return partially matched emojis", function () {
      var matchingEmojis = emoji.search("cof");
      matchingEmojis.length.should.not.eql(0);
      matchingEmojis.forEach(function(emoji) {
        emoji.key.should.match(/^cof/);
      });
    });

    it("should only include emojies that begin with the search", function () {
      var matchingEmojis = emoji.search("ca");
      matchingEmojis.length.should.not.eql(0);
      matchingEmojis.forEach(function(emoji) {
        var index = emoji.key.indexOf("ca");
        index.should.be.exactly(0);
      });
    });

    it("should match when you include the colon", function () {
      var matchingEmojis = emoji.search(":c");
      matchingEmojis.length.should.not.eql(0);
      matchingEmojis.forEach(function(emoji) {
        var index = emoji.key.indexOf("c");
        index.should.be.exactly(0);
      });
    });

    it("should return an empty array when no matching emojis are found", function () {
      var matchingEmojis = emoji.search("notAnEmoji");
      matchingEmojis.length.should.be.exactly(0);
    });
  });
});
