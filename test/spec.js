describe('controller', function () {
  var ctrl;
  var root;
  beforeEach(module('lrTypeaheadMultiSelect'));
  beforeEach(inject(function ($controller, $rootScope) {
    ctrl = $controller('lrTypeaheadCtrl');
    root = $rootScope;
  }));

  it('should add a new value', function () {
    ctrl.addValue({foo: 'bar'});
    expect(ctrl.valueCollection.length).toBe(1);
    expect(ctrl.valueCollection[0]).toEqual({foo: 'bar'});
  });

  it('should not add an existing value', function () {
    var item = {foo: 'bar'};
    ctrl.addValue(item);
    expect(ctrl.valueCollection.length).toBe(1);
    expect(ctrl.valueCollection[0]).toEqual(item);
    ctrl.addValue(item);
    expect(ctrl.valueCollection.length).toBe(1);
  });

  it('should remove a specific value', function () {
    var item1 = {foo: 'bar'};
    var item2 = {foo: 'bar2'};
    ctrl.addValue(item1);
    ctrl.addValue(item2);
    expect(ctrl.valueCollection.length).toBe(2);
    expect(ctrl.valueCollection[0]).toEqual(item1);
    ctrl.removeValue(item1);
    expect(ctrl.valueCollection.length).toBe(1);
    expect(ctrl.valueCollection[0]).toEqual(item2);
  });

  it('should remove the last value by default', function () {
    var item1 = {foo: 'bar'};
    var item2 = {foo: 'bar2'};
    ctrl.addValue(item1);
    ctrl.addValue(item2);
    expect(ctrl.valueCollection.length).toBe(2);
    expect(ctrl.valueCollection[0]).toEqual(item1);
    ctrl.removeValue();
    expect(ctrl.valueCollection.length).toBe(1);
    expect(ctrl.valueCollection[0]).toEqual(item1);
  });

  it('should suggest based on the suggest function provided ', function () {
    ctrl.suggester = function (input) {
      return [{val: input + '1'}, {val: input + '2'}, {val: input + '3'}];
    };
    ctrl.suggest('foo');
    expect(ctrl.isLoading).toBe(true);
    root.$digest();
    expect(ctrl.suggestions).toEqual([{val: 'foo1'}, {val: 'foo2'}, {val: 'foo3'}]);
    expect(ctrl.suggestionInput).toEqual('foo');
    expect(ctrl.isLoading).toBe(false);
  });

  it('should filter out suggestion which are already part of collection value', function () {
    var suggestions = [{val: '1'}, {val: '2'}, {val: '3'}];
    ctrl.suggester = function (input) {
      return suggestions;
    };
    ctrl.addValue((suggestions[0]));
    ctrl.suggest('foo');
    expect(ctrl.isLoading).toBe(true);
    root.$digest();
    expect(ctrl.suggestionInput).toEqual('foo');
    expect(ctrl.suggestions).toEqual([{val: '2'}, {val: '3'}]);
    expect(ctrl.isLoading).toBe(false);
  });

  it('should highlight the first itme of suggestion list', function () {
    var suggestions = [{val: '1'}, {val: '2'}, {val: '3'}];
    ctrl.suggester = function (input) {
      return suggestions;
    };
    ctrl.suggest('foo');
    expect(ctrl.isLoading).toBe(true);
    root.$digest();
    expect(ctrl.suggestionInput).toEqual('foo');
    expect(ctrl.suggestions).toEqual([{val: '1'}, {val: '2'}, {val: '3'}]);
    expect(ctrl.isLoading).toBe(false);
    expect(ctrl.isHighlighted(suggestions[0])).toBe(true);
    expect(ctrl.isHighlighted(suggestions[1])).toBe(false);
    expect(ctrl.isHighlighted(suggestions[2])).toBe(false);
  });

  it('should highlight the next/previous item', function () {
    var suggestions = [{val: '1'}, {val: '2'}, {val: '3'}];
    ctrl.suggester = function (input) {
      return suggestions;
    };
    ctrl.suggest('foo');
    expect(ctrl.isLoading).toBe(true);
    root.$digest();
    expect(ctrl.suggestionInput).toEqual('foo');
    expect(ctrl.suggestions).toEqual([{val: '1'}, {val: '2'}, {val: '3'}]);
    expect(ctrl.isLoading).toBe(false);
    expect(ctrl.isHighlighted(suggestions[0])).toBe(true);
    expect(ctrl.isHighlighted(suggestions[1])).toBe(false);
    expect(ctrl.isHighlighted(suggestions[2])).toBe(false);
    ctrl.highlightNext();
    expect(ctrl.isHighlighted(suggestions[0])).toBe(false);
    expect(ctrl.isHighlighted(suggestions[1])).toBe(true);
    expect(ctrl.isHighlighted(suggestions[2])).toBe(false);
    ctrl.highlightNext();
    expect(ctrl.isHighlighted(suggestions[0])).toBe(false);
    expect(ctrl.isHighlighted(suggestions[1])).toBe(false);
    expect(ctrl.isHighlighted(suggestions[2])).toBe(true);
    ctrl.highlightPrevious();
    expect(ctrl.isHighlighted(suggestions[0])).toBe(false);
    expect(ctrl.isHighlighted(suggestions[1])).toBe(true);
    expect(ctrl.isHighlighted(suggestions[2])).toBe(false);
    ctrl.highlightPrevious();
    expect(ctrl.isHighlighted(suggestions[0])).toBe(true);
    expect(ctrl.isHighlighted(suggestions[1])).toBe(false);
    expect(ctrl.isHighlighted(suggestions[2])).toBe(false);
  });

  it('should reset suggestion when a value is added', function () {
    var suggestions = [{val: '1'}, {val: '2'}, {val: '3'}];
    ctrl.suggester = function (input) {
      return suggestions;
    };
    ctrl.suggest('foo');
    expect(ctrl.isLoading).toBe(true);
    root.$digest();
    expect(ctrl.suggestionInput).toEqual('foo');
    expect(ctrl.suggestions).toEqual([{val: '1'}, {val: '2'}, {val: '3'}]);
    expect(ctrl.isLoading).toBe(false);
    expect(ctrl.isHighlighted(suggestions[0])).toBe(true);
    expect(ctrl.isHighlighted(suggestions[1])).toBe(false);
    expect(ctrl.isHighlighted(suggestions[2])).toBe(false);
    ctrl.addValue(suggestions[0]);
    expect(ctrl.isHighlighted(suggestions[0])).toBe(false);
    expect(ctrl.isHighlighted(suggestions[1])).toBe(false);
    expect(ctrl.isHighlighted(suggestions[2])).toBe(false);
    expect(ctrl.suggestions.length).toBe(0);
    expect(ctrl.suggestionInput).toEqual('');
  });


});