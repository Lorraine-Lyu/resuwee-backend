async function addInfo(ctx, info) {
    ctx.body+= info;
}

module.exports.addInfo = addInfo;