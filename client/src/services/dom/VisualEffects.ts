
function trailAttack() {
  const barElement = document.createElement('div');
  barElement.style.position = 'absolute';
  barElement.style.height = '20px';
  barElement.style.background = '#ba021e';
  barElement.style.width = '3px';
  barElement.style.transformOrigin = 'center center';
  return barElement;
}

function trailHeal() {
  const barElement = document.createElement('div');
  barElement.style.position = 'absolute';
  barElement.style.height = '20px';
  barElement.style.background = '#14e00d';
  barElement.style.width = '3px';
  barElement.style.transformOrigin = 'center center';
  return barElement;
}

const VisualEffects = {
  trailAttack,
  trailHeal
};

export default VisualEffects