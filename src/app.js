document.addEventListener('DOMContentLoaded', () => {
    const grid = document.querySelector('.grid');
    let width = 24;
    let height = 20;
    let bombAmount = 99;
    let gridid=[];
    let isGameOver = false;
    let flagcount = 0;

    // Create the grid for minesweeper
    // 24 * 20 = 480 cells
    function createGrid(){
        //create the 99 bombs
        const bombsArray = Array(bombAmount).fill('bomb');
        //create the rest of the cells, and a frame around the grid
        const emptyArray = Array((width+2) * (height+2) - bombAmount).fill('empty');

        const gameArray = emptyArray.concat(bombsArray);
        //make sure the edges or 'frame' are empty
        for(let i=0;i<gameArray.length;i++){
            //if an element on the edge of the grid is a bomb,
            if( (i<=width+2 || i>=gameArray.length-width-2 || i%(width+2)===0 || i%(width+2)===width+1) && gameArray[i]==='bomb'){
                //find the first empty cell that is not on the frame nor a bomb and swap them
                for(let j=0;j<gameArray.length;j++){
                    if(!(j<=width+2 || j>=gameArray.length-width-2 || j%(width+2)===0 || j%(width+2)===width+1)&& gameArray[j]==='empty'){
                        //swap the elements
                        gameArray[i]= 'empty';
                        gameArray[j]= 'bomb';
                        break;
                    }

                }
                    
            }

        }
        //swap the frame elemets tagged as 'empty' with 'edge'
        for(let i=0;i<gameArray.length;i++){
            if(gameArray[i]==='empty'&&(i<=width+2 || i>=gameArray.length-width-2 || i%(width+2)===0 || i%(width+2)===width+1)){
                gameArray[i]= 'edge';
            }
        }


        //shuffle the cells that are not 'edge'
        let shuffledArray = gameArray;
        var m, temp;
        for(let l=0;l < shuffledArray.length;l++){
            if(gameArray[l]==='edge'){ continue;
            }else{
                do{
                    m = Math.floor(Math.random() * l+1);
                }while(gameArray[m]==='edge');
                }
                temp = shuffledArray[m];
                shuffledArray[m] = shuffledArray[l];
                shuffledArray[l] = temp;
        }
        //create the grid
        for(let i=0; i < (width+2) * (height+2); i++){
            const cell = document.createElement('div');
            cell.setAttribute('id', i);
            cell.classList.add(shuffledArray[i]);
            grid.appendChild(cell);
            gridid.push(cell);
        

            //click event for each cell
            cell.addEventListener('click', function(e) {
                click(cell)

            })
            //right click event for each cell
            cell.addEventListener('contextmenu', function(e) {
                e.preventDefault();
                addFlag(cell);
            })
        }
        //adding the numbers to cells neighbouring bombs
        for(let i=0;i<gridid.length;i++){
            let bombcount = 0;
            if(gridid[i].classList.contains('empty')){
                //check the 8 neighbouring cells for bombs
                if(gridid[i-1].classList.contains('bomb')){bombcount++;}//left
                if(gridid[i+1].classList.contains('bomb')){bombcount++;}//right
                if(gridid[i-width-3].classList.contains('bomb')){bombcount++;}//up left
                if(gridid[i-width-2].classList.contains('bomb')){bombcount++;}//up
                if(gridid[i-width-1].classList.contains('bomb')){bombcount++;}//up right
                if(gridid[i+width+1].classList.contains('bomb')){bombcount++;}//down left
                if(gridid[i+width+2].classList.contains('bomb')){bombcount++;}//down
                if(gridid[i+width+3].classList.contains('bomb')){bombcount++;}//down right

            }
            gridid[i].setAttribute('data-bombs', bombcount);
        }      
    }

    createGrid();

    //add the flag to the cell when right clicked
    function addFlag(cell){
        if(isGameOver){
            return;
        }
        if(cell.classList.contains('clicked')){
            return;
        }
        if(cell.classList.contains('flagged')){
            cell.classList.remove('flagged');
            flagcount--;
            cell.innerHTML = '';
            return;
        }
        if(flagcount===bombAmount){
            return;
        }
        cell.classList.add('flagged');
        flagcount++;
        cell.innerHTML = '🚩';
        
        checkWin();
    }




    //click on cell
    function click(cell){
        if(isGameOver){
            return;
        }

        if(cell.classList.contains('clicked') || cell.classList.contains('flagged')||cell.classList.contains('edge')){
            return;
        }

        if(cell.classList.contains('bomb')){
            //alert('Game Over!')
            GameOver(cell);


        }else{
            let bombcount = cell.getAttribute('data-bombs');
            if(bombcount>0){
                cell.classList.add('clicked');
                if(bombcount!=0){
                    cell.innerHTML = bombcount;
                }
                return;
            }
        }
        cell.classList.add('clicked');
        checkWin();
        check(cell)
    }
    //checking if the cell has been checked or flagged
    function check(cell){
        const cellid = parseInt(cell.id);
        const left = gridid[cellid-1];
        const right = gridid[cellid+1];
        const up = gridid[cellid-width-2];
        const down = gridid[cellid+width+2];
        const upLeft = gridid[cellid-width-3];
        const upRight = gridid[cellid-width-1];
        const downLeft = gridid[cellid+width+1];
        const downRight = gridid[cellid+width+3];
        //delay for cascading effect
        setTimeout(() => {
            

            if(!left.classList.contains('clicked') && !left.classList.contains('flagged') && !left.classList.contains('bomb')){
                click(left);
            }
            if(!right.classList.contains('clicked') && !right.classList.contains('flagged') && !right.classList.contains('bomb')){
                click(right);
            }
            if(!up.classList.contains('clicked') && !up.classList.contains('flagged') && !up.classList.contains('bomb')){
                click(up);
            }
            if(!down.classList.contains('clicked') && !down.classList.contains('flagged') && !down.classList.contains('bomb')){
                click(down);
            }
            if(!upLeft.classList.contains('clicked') && !upLeft.classList.contains('flagged') && !upLeft.classList.contains('bomb')){
                click(upLeft);
            }
            if(!upRight.classList.contains('clicked') && !upRight.classList.contains('flagged') && !upRight.classList.contains('bomb')){
                click(upRight);
            }
            if(!downLeft.classList.contains('clicked') && !downLeft.classList.contains('flagged') && !downLeft.classList.contains('bomb')){
                click(downLeft);
            }
            if(!downRight.classList.contains('clicked') && !downRight.classList.contains('flagged') && !downRight.classList.contains('bomb')){
                click(downRight);
            }
        
        }, 50);
    }


    function GameOver(cell){
        console.log('Game Over!');
        isGameOver = true;
        setTimeout(() => {  
            gridid.forEach(cell => {
                if(cell.classList.contains('bomb')){
                    cell.innerHTML = '💣';
                }
            }, 500000);
        })
        //delay the alert to show the bombs
        setTimeout(() => {
            alert('Game Over!');
        }, 40);
    }
    function checkWin(){
        let count = 0;
        let bombmatches = 0;
        gridid.forEach(cell => {
            if(cell.classList.contains('clicked')){
                count++;
            }
            if(cell.classList.contains('bomb') && cell.classList.contains('flagged')){
                bombmatches++;
            }
        })
        if(count===gridid.length-2*width+2*length+4-bombAmount || bombmatches===bombAmount){
            setTimeout(() => {
                alert('You Win!');
            }, 40);
            isGameOver = true;
        }
    }





















































})